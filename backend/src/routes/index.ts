import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { accountsRouter } from '../modules/accounts/accounts.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { categoriesRouter } from '../modules/categories/categories.routes.js';
import { transactionsRouter } from '../modules/transactions/transactions.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', requireAuth, usersRouter);
apiRouter.use('/accounts', requireAuth, accountsRouter);
apiRouter.use('/categories', requireAuth, categoriesRouter);
apiRouter.use('/transactions', requireAuth, transactionsRouter);
