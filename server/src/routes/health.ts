import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('WebAuthn Server is running with SQLite!');
});

export default router;