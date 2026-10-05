import { db } from './index.js';

/** Either the root connection or a transaction handle, so services can run inside `db.transaction`. */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Executor = typeof db | Tx;
