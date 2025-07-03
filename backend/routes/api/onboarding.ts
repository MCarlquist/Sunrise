import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    // Placeholder onboarding logic
    res.json({ message: "You're personalization is complete.", successful_onboarding: true });
});

export default router;
