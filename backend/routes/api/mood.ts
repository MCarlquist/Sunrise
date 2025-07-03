import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    // Placeholder response
    res.json({ mood: 'happy to be alive today. It is only for toay' });
});

export default router;
