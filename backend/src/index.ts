import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { apiRouter } from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  await db.execute(sql`select 1`);
  res.json({
    status: "ok",
  });
});

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

