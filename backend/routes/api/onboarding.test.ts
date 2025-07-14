import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../lib/prisma';
import { jest } from '@jest/globals';

// Mock external dependencies
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    onboardingStep: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../lib/auth', () => ({
  validateToken: jest.fn(),
  generateToken: jest.fn(),
}));

jest.mock('../../lib/email', () => ({
  sendWelcomeEmail: jest.fn(),
}));

describe('Onboarding API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/onboarding/start', () => {
    const validOnboardingData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company',
      role: 'Developer',
    };

    it('should successfully start onboarding with valid data', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        onboardingCompleted: false,
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.onboardingStep.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        step: 'profile',
        completed: false,
      });

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(validOnboardingData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        user: mockUser,
        message: 'Onboarding started successfully',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          company: 'Test Company',
          role: 'Developer',
          onboardingCompleted: false,
        }),
      });
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        email: 'test@example.com',
        // Missing firstName, lastName, company, role
      };

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Missing required fields',
        details: expect.any(Array),
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmailData = {
        ...validOnboardingData,
        email: 'invalid-email-format',
      };

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(invalidEmailData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid email format',
      });
    });

    it('should return 409 for duplicate email', async () => {
      const duplicateError = new Error('Duplicate email');
      (duplicateError as any).code = 'P2002';

      (prisma.user.create as jest.Mock).mockRejectedValue(duplicateError);

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(validOnboardingData)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        error: 'User with this email already exists',
      });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(validOnboardingData)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/onboarding/start')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Missing required fields',
        details: expect.any(Array),
      });
    });

    it('should trim whitespace from string fields', async () => {
      const dataWithWhitespace = {
        email: '  test@example.com  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
        company: '  Test Company  ',
        role: '  Developer  ',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        onboardingCompleted: false,
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      await request(app)
        .post('/api/onboarding/start')
        .send(dataWithWhitespace)
        .expect(201);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          company: 'Test Company',
          role: 'Developer',
        }),
      });
    });
  });

  describe('GET /api/onboarding/steps/:userId', () => {
    it('should return onboarding steps for valid user', async () => {
      const mockSteps = [
        { id: 1, step: 'profile', completed: true, userId: 1 },
        { id: 2, step: 'preferences', completed: false, userId: 1 },
        { id: 3, step: 'verification', completed: false, userId: 1 },
      ];

      (prisma.onboardingStep.findMany as jest.Mock).mockResolvedValue(mockSteps);

      const response = await request(app)
        .get('/api/onboarding/steps/1')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        steps: mockSteps,
        completedSteps: 1,
        totalSteps: 3,
      });
    });

    it('should return 404 for non-existent user', async () => {
      (prisma.onboardingStep.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/onboarding/steps/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'User not found or no onboarding steps',
      });
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/onboarding/steps/invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid user ID',
      });
    });

    it('should handle database errors', async () => {
      (prisma.onboardingStep.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app)
        .get('/api/onboarding/steps/1')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('PUT /api/onboarding/step/:stepId', () => {
    const validStepUpdate = {
      completed: true,
      data: {
        preferences: ['email', 'push'],
      },
    };

    it('should successfully update onboarding step', async () => {
      const mockUpdatedStep = {
        id: 1,
        step: 'preferences',
        completed: true,
        userId: 1,
        data: { preferences: ['email', 'push'] },
      };

      (prisma.onboardingStep.update as jest.Mock).mockResolvedValue(mockUpdatedStep);

      const response = await request(app)
        .put('/api/onboarding/step/1')
        .send(validStepUpdate)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        step: mockUpdatedStep,
        message: 'Step updated successfully',
      });

      expect(prisma.onboardingStep.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: validStepUpdate,
      });
    });

    it('should return 404 for non-existent step', async () => {
      (prisma.onboardingStep.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      const response = await request(app)
        .put('/api/onboarding/step/999')
        .send(validStepUpdate)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Onboarding step not found',
      });
    });

    it('should return 400 for invalid step ID', async () => {
      const response = await request(app)
        .put('/api/onboarding/step/invalid')
        .send(validStepUpdate)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid step ID',
      });
    });

    it('should validate completed field type', async () => {
      const invalidUpdate = {
        completed: 'not a boolean',
      };

      const response = await request(app)
        .put('/api/onboarding/step/1')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid data types',
      });
    });
  });

  describe('POST /api/onboarding/complete/:userId', () => {
    it('should successfully complete onboarding', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        onboardingCompleted: true,
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/onboarding/complete/1')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        user: mockUser,
        message: 'Onboarding completed successfully',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { onboardingCompleted: true },
      });
    });

    it('should return 404 for non-existent user', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      const response = await request(app)
        .post('/api/onboarding/complete/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'User not found',
      });
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .post('/api/onboarding/complete/invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid user ID',
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/onboarding/start')
        .send('invalid json')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid JSON format',
      });
    });

    it('should handle extremely long field values', async () => {
      const longString = 'a'.repeat(1000);
      const dataWithLongValues = {
        email: 'test@example.com',
        firstName: longString,
        lastName: longString,
        company: longString,
        role: longString,
      };

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(dataWithLongValues)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Field values too long',
      });
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousData = {
        email: 'test@example.com',
        firstName: "'; DROP TABLE users; --",
        lastName: 'Doe',
        company: 'Test Company',
        role: 'Developer',
      };

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        firstName: "'; DROP TABLE users; --",
        lastName: 'Doe',
        onboardingCompleted: false,
      });

      const response = await request(app)
        .post('/api/onboarding/start')
        .send(maliciousData)
        .expect(201);

      // Should still succeed but with sanitized data
      expect(response.body.success).toBe(true);
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should handle concurrent requests gracefully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        onboardingCompleted: false,
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const requests = Array(10).fill(null).map(() =>
        request(app)
          .post('/api/onboarding/start')
          .send(validOnboardingData)
      );

      const responses = await Promise.all(requests);

      // First request should succeed, others should fail with duplicate email
      const successfulResponses = responses.filter(r => r.status === 201);
      const failedResponses = responses.filter(r => r.status === 409);

      expect(successfulResponses.length).toBeGreaterThan(0);
      expect(failedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for protected endpoints', async () => {
      const response = await request(app)
        .get('/api/onboarding/steps/1')
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'Authentication required',
      });
    });

    it('should validate user permissions for user-specific operations', async () => {
      const response = await request(app)
        .get('/api/onboarding/steps/1')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toEqual({
        success: false,
        error: 'Insufficient permissions',
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large datasets efficiently', async () => {
      const largeStepsArray = Array(100).fill(null).map((_, index) => ({
        id: index + 1,
        step: `step_${index}`,
        completed: index % 2 === 0,
        userId: 1,
      }));

      (prisma.onboardingStep.findMany as jest.Mock).mockResolvedValue(largeStepsArray);

      const response = await request(app)
        .get('/api/onboarding/steps/1')
        .expect(200);

      expect(response.body.steps).toHaveLength(100);
      expect(response.body.completedSteps).toBe(50);
    });

    it('should implement proper pagination for large results', async () => {
      const response = await request(app)
        .get('/api/onboarding/steps/1?page=2&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 10,
        total: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: expect.any(Boolean),
      });
    });
  });
});