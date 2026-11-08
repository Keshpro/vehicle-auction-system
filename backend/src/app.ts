import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());
app.get('/api/health', (_req, res) => { res.json({ status: 'ok', service: 'vehicle-auction-api' }); });
export default app;
