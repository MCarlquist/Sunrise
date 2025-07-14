import request from 'supertest';
import { app } from '../../../app';
import { MoodService } from '../../../services/MoodService';
import { AuthService } from '../../../services/AuthService';
import { ValidationError, NotFoundError, UnauthorizedError } from '../../../utils/errors';
import { MoodEntry, MoodType } from '../../../types/mood';

// Mock external dependencies
jest.mock('../../../services/MoodService');
jest.mock('../../../services/AuthService');

const mockMoodService = MoodService as jest.Mocked<typeof MoodService>;
const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('Mood API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/mood', () => {
    const mockUserId = 'user123';
    const mockMoodEntries: MoodEntry[] = [
      {
        id: '1',
        userId: mockUserId,
        mood: MoodType.HAPPY,
        note: 'Great day!',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z')
      },
      {
        id: '2',
        userId: mockUserId,
        mood: MoodType.SAD,
        note: 'Not feeling well',
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z')
      }
    ];

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should return mood entries for authenticated user', async () => {
      mockMoodService.getMoodEntries.mockResolvedValue(mockMoodEntries);

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockMoodEntries
      });
      expect(mockMoodService.getMoodEntries).toHaveBeenCalledWith(mockUserId);
    });

    it('should return filtered mood entries by date range', async () => {
      const filteredEntries = [mockMoodEntries[0]];
      mockMoodService.getMoodEntries.mockResolvedValue(filteredEntries);

      const response = await request(app)
        .get('/api/mood')
        .query({
          startDate: '2023-01-01',
          endDate: '2023-01-01'
        })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(filteredEntries);
      expect(mockMoodService.getMoodEntries).toHaveBeenCalledWith(
        mockUserId,
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
    });

    it('should return filtered mood entries by mood type', async () => {
      const filteredEntries = [mockMoodEntries[0]];
      mockMoodService.getMoodEntries.mockResolvedValue(filteredEntries);

      const response = await request(app)
        .get('/api/mood')
        .query({ moodType: MoodType.HAPPY })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(filteredEntries);
      expect(mockMoodService.getMoodEntries).toHaveBeenCalledWith(
        mockUserId,
        undefined,
        undefined,
        MoodType.HAPPY
      );
    });

    it('should return 401 when no authorization header is provided', async () => {
      const response = await request(app).get('/api/mood');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 401 when token is invalid', async () => {
      mockAuthService.validateToken.mockRejectedValue(new UnauthorizedError('Invalid token'));

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid token'
      });
    });

    it('should return 400 when date range is invalid', async () => {
      const response = await request(app)
        .get('/api/mood')
        .query({
          startDate: 'invalid-date',
          endDate: '2023-01-01'
        })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid date format'
      });
    });

    it('should return 500 when service throws unexpected error', async () => {
      mockMoodService.getMoodEntries.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });

    it('should return empty array when user has no mood entries', async () => {
      mockMoodService.getMoodEntries.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: []
      });
    });

    it('should handle pagination parameters', async () => {
      mockMoodService.getMoodEntries.mockResolvedValue(mockMoodEntries);

      const response = await request(app)
        .get('/api/mood')
        .query({ page: '1', limit: '10' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(mockMoodService.getMoodEntries).toHaveBeenCalledWith(
        mockUserId,
        undefined,
        undefined,
        undefined,
        1,
        10
      );
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/mood')
        .query({ page: '-1', limit: '0' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid pagination parameters'
      });
    });
  });

  describe('POST /api/mood', () => {
    const mockUserId = 'user123';
    const validMoodData = {
      mood: MoodType.HAPPY,
      note: 'Feeling great today!'
    };

    const mockCreatedEntry: MoodEntry = {
      id: 'mood123',
      userId: mockUserId,
      mood: MoodType.HAPPY,
      note: 'Feeling great today!',
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T10:00:00Z')
    };

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should create a new mood entry successfully', async () => {
      mockMoodService.createMoodEntry.mockResolvedValue(mockCreatedEntry);

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send(validMoodData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedEntry
      });
      expect(mockMoodService.createMoodEntry).toHaveBeenCalledWith(
        mockUserId,
        validMoodData.mood,
        validMoodData.note
      );
    });

    it('should create mood entry without note', async () => {
      const dataWithoutNote = { mood: MoodType.NEUTRAL };
      const entryWithoutNote = { ...mockCreatedEntry, note: undefined };
      mockMoodService.createMoodEntry.mockResolvedValue(entryWithoutNote);

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send(dataWithoutNote);

      expect(response.status).toBe(201);
      expect(mockMoodService.createMoodEntry).toHaveBeenCalledWith(
        mockUserId,
        MoodType.NEUTRAL,
        undefined
      );
    });

    it('should return 400 when mood type is missing', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ note: 'Just a note' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Mood type is required'
      });
    });

    it('should return 400 when mood type is invalid', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: 'INVALID_MOOD', note: 'Test note' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid mood type'
      });
    });

    it('should return 400 when note is too long', async () => {
      const longNote = 'a'.repeat(1001); // Assuming 1000 char limit
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: MoodType.HAPPY, note: longNote });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Note cannot exceed 1000 characters'
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/mood')
        .send(validMoodData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 401 when token is invalid', async () => {
      mockAuthService.validateToken.mockRejectedValue(new UnauthorizedError('Invalid token'));

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer invalid-token')
        .send(validMoodData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid token'
      });
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Mood type is required'
      });
    });

    it('should return 500 when service throws unexpected error', async () => {
      mockMoodService.createMoodEntry.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send(validMoodData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });

    it('should sanitize HTML in note field', async () => {
      const maliciousNote = '<script>alert("xss")</script>Safe note';
      const sanitizedEntry = { ...mockCreatedEntry, note: 'Safe note' };
      mockMoodService.createMoodEntry.mockResolvedValue(sanitizedEntry);

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: MoodType.HAPPY, note: maliciousNote });

      expect(response.status).toBe(201);
      expect(mockMoodService.createMoodEntry).toHaveBeenCalledWith(
        mockUserId,
        MoodType.HAPPY,
        'Safe note'
      );
    });

    it('should trim whitespace from note field', async () => {
      const noteWithWhitespace = '   Feeling good   ';
      const trimmedEntry = { ...mockCreatedEntry, note: 'Feeling good' };
      mockMoodService.createMoodEntry.mockResolvedValue(trimmedEntry);

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: MoodType.HAPPY, note: noteWithWhitespace });

      expect(response.status).toBe(201);
      expect(mockMoodService.createMoodEntry).toHaveBeenCalledWith(
        mockUserId,
        MoodType.HAPPY,
        'Feeling good'
      );
    });
  });

  describe('GET /api/mood/:id', () => {
    const mockUserId = 'user123';
    const mockMoodId = 'mood123';
    const mockMoodEntry: MoodEntry = {
      id: mockMoodId,
      userId: mockUserId,
      mood: MoodType.HAPPY,
      note: 'Great day!',
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T10:00:00Z')
    };

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should return mood entry by id', async () => {
      mockMoodService.getMoodEntryById.mockResolvedValue(mockMoodEntry);

      const response = await request(app)
        .get(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockMoodEntry
      });
      expect(mockMoodService.getMoodEntryById).toHaveBeenCalledWith(mockMoodId, mockUserId);
    });

    it('should return 404 when mood entry not found', async () => {
      mockMoodService.getMoodEntryById.mockRejectedValue(new NotFoundError('Mood entry not found'));

      const response = await request(app)
        .get(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: 'Mood entry not found'
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app).get(`/api/mood/${mockMoodId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 400 when id format is invalid', async () => {
      const response = await request(app)
        .get('/api/mood/invalid-id-format')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid mood entry ID format'
      });
    });

    it('should return 403 when user tries to access another users mood entry', async () => {
      mockMoodService.getMoodEntryById.mockRejectedValue(new UnauthorizedError('Access denied'));

      const response = await request(app)
        .get(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        success: false,
        error: 'Access denied'
      });
    });
  });

  describe('PUT /api/mood/:id', () => {
    const mockUserId = 'user123';
    const mockMoodId = 'mood123';
    const updateData = {
      mood: MoodType.NEUTRAL,
      note: 'Updated note'
    };

    const mockUpdatedEntry: MoodEntry = {
      id: mockMoodId,
      userId: mockUserId,
      mood: MoodType.NEUTRAL,
      note: 'Updated note',
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T12:00:00Z')
    };

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should update mood entry successfully', async () => {
      mockMoodService.updateMoodEntry.mockResolvedValue(mockUpdatedEntry);

      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedEntry
      });
      expect(mockMoodService.updateMoodEntry).toHaveBeenCalledWith(
        mockMoodId,
        mockUserId,
        updateData
      );
    });

    it('should update only mood without note', async () => {
      const moodOnlyUpdate = { mood: MoodType.SAD };
      const updatedEntry = { ...mockUpdatedEntry, mood: MoodType.SAD };
      mockMoodService.updateMoodEntry.mockResolvedValue(updatedEntry);

      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(moodOnlyUpdate);

      expect(response.status).toBe(200);
      expect(mockMoodService.updateMoodEntry).toHaveBeenCalledWith(
        mockMoodId,
        mockUserId,
        moodOnlyUpdate
      );
    });

    it('should return 404 when mood entry not found', async () => {
      mockMoodService.updateMoodEntry.mockRejectedValue(new NotFoundError('Mood entry not found'));

      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: 'Mood entry not found'
      });
    });

    it('should return 400 when update data is invalid', async () => {
      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: 'INVALID_MOOD' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid mood type'
      });
    });

    it('should return 400 when no update data provided', async () => {
      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'At least one field must be provided for update'
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 403 when user tries to update another users mood entry', async () => {
      mockMoodService.updateMoodEntry.mockRejectedValue(new UnauthorizedError('Access denied'));

      const response = await request(app)
        .put(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        success: false,
        error: 'Access denied'
      });
    });
  });

  describe('DELETE /api/mood/:id', () => {
    const mockUserId = 'user123';
    const mockMoodId = 'mood123';

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should delete mood entry successfully', async () => {
      mockMoodService.deleteMoodEntry.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Mood entry deleted successfully'
      });
      expect(mockMoodService.deleteMoodEntry).toHaveBeenCalledWith(mockMoodId, mockUserId);
    });

    it('should return 404 when mood entry not found', async () => {
      mockMoodService.deleteMoodEntry.mockRejectedValue(new NotFoundError('Mood entry not found'));

      const response = await request(app)
        .delete(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: 'Mood entry not found'
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app).delete(`/api/mood/${mockMoodId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 403 when user tries to delete another users mood entry', async () => {
      mockMoodService.deleteMoodEntry.mockRejectedValue(new UnauthorizedError('Access denied'));

      const response = await request(app)
        .delete(`/api/mood/${mockMoodId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        success: false,
        error: 'Access denied'
      });
    });

    it('should return 400 when id format is invalid', async () => {
      const response = await request(app)
        .delete('/api/mood/invalid-id-format')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid mood entry ID format'
      });
    });
  });

  describe('GET /api/mood/analytics', () => {
    const mockUserId = 'user123';
    const mockAnalytics = {
      totalEntries: 10,
      moodDistribution: {
        [MoodType.HAPPY]: 4,
        [MoodType.SAD]: 2,
        [MoodType.NEUTRAL]: 3,
        [MoodType.ANGRY]: 1
      },
      averageMoodScore: 3.2,
      streaks: {
        current: 5,
        longest: 12
      }
    };

    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: mockUserId });
    });

    it('should return mood analytics', async () => {
      mockMoodService.getMoodAnalytics.mockResolvedValue(mockAnalytics);

      const response = await request(app)
        .get('/api/mood/analytics')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockAnalytics
      });
      expect(mockMoodService.getMoodAnalytics).toHaveBeenCalledWith(mockUserId);
    });

    it('should return analytics with date range filter', async () => {
      mockMoodService.getMoodAnalytics.mockResolvedValue(mockAnalytics);

      const response = await request(app)
        .get('/api/mood/analytics')
        .query({
          startDate: '2023-01-01',
          endDate: '2023-01-31'
        })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(mockMoodService.getMoodAnalytics).toHaveBeenCalledWith(
        mockUserId,
        new Date('2023-01-01'),
        new Date('2023-01-31')
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app).get('/api/mood/analytics');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Authorization header required'
      });
    });

    it('should return 400 when date range is invalid', async () => {
      const response = await request(app)
        .get('/api/mood/analytics')
        .query({
          startDate: 'invalid-date',
          endDate: '2023-01-31'
        })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid date format'
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    beforeEach(() => {
      mockAuthService.validateToken.mockResolvedValue({ userId: 'user123' });
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid JSON in request body'
      });
    });

    it('should handle requests with missing content-type header', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send('mood=happy');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Content-Type must be application/json'
      });
    });

    it('should handle concurrent requests gracefully', async () => {
      const validMoodData = { mood: MoodType.HAPPY, note: 'Test' };
      const mockEntry = {
        id: 'mood123',
        userId: 'user123',
        mood: MoodType.HAPPY,
        note: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockMoodService.createMoodEntry.mockResolvedValue(mockEntry);

      const promises = Array.from({ length: 5 }, () =>
        request(app)
          .post('/api/mood')
          .set('Authorization', 'Bearer valid-token')
          .send(validMoodData)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });
    });

    it('should handle extremely large request payloads', async () => {
      const largeNote = 'a'.repeat(10000);
      
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', 'Bearer valid-token')
        .send({ mood: MoodType.HAPPY, note: largeNote });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Request payload too large'
      });
    });

    it('should handle database connection timeouts', async () => {
      mockMoodService.getMoodEntries.mockRejectedValue(new Error('Connection timeout'));

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });
  });
});