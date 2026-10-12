import app from './app';
import { db } from './prisma/db';

const server = app.listen(3000, () => console.log('listening on :3000'));

process.on('SIGTERM', async () => {
  server.close();
  await db.close();
});
