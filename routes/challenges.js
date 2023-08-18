import { Router } from 'express';
import { SignJWT } from 'jose';
import { configuration } from '../conf.js';

const router = Router();
const alg = 'HS256';
export const secret = new TextEncoder().encode(configuration ?? 'C3x?ncj55j=rxRKZg*DF=tQiq<mFUcyJ!Un5Ki4j');
export const issuer = 'comment-me';

router.post('/1', async (req, res, next) => {
  const jwt = await new SignJWT({ 'challenge': '1' })
    .setProtectedHeader({ alg })
    .setIssuer(issuer)
    .setExpirationTime('3s')
    .sign(secret);
  res.header({ Authorization: jwt });
  res.status(201);
  res.send();
});

export default router;
