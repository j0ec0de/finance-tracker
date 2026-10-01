import express from 'express';
import type { Request, Response } from 'express';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

