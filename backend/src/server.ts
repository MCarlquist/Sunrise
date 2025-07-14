import express from 'express';
import suggestionsRouter from '../routes/api/suggestions';
import moodRouter from '../routes/api/mood';
import onboardingRouter from '../routes/api/onboarding';
import activitiesRouter from '../routes/api/activities';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

morgan('tiny'); // Log requests to the console
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use('/api/suggestions', suggestionsRouter);
app.use('/api/mood', moodRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/activities', activitiesRouter);

app.get('/', (req, res) => {
    res.send('Hello from backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
