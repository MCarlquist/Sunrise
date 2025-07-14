/**
 * GET /api/mood
 * Returns the current mood status with an encouraging message.
 *
 * @route GET /api/mood
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Object} 200 - Mood response object
 * @returns {string} 200.mood - The current mood message
 * @example
 * // GET /api/mood
 * // Response:
 * // {
 * //   "mood": "happy to be alive today. It is only for today"
 * // }
 */
router.get('/', (req, res) => {
    res.json({ mood: 'happy to be alive today. It is only for today' });
});

export default router;

