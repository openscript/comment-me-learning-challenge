import { Router } from 'express';
import { SignJWT } from 'jose';

const router = Router();
const alg = 'HS256';
export const secret = new TextEncoder().encode('C3x?ncj55j=rxRKZg*DF=tQiq<mFUcyJ!Un5Ki4j');
export const issuer = 'comment-me';

router.get('/1', async (req, res, next) => {
  const jwt = await new SignJWT({ 'challenge': '1' })
    .setProtectedHeader({ alg })
    .setIssuer(issuer)
    .setExpirationTime('10h')
    .sign(secret);
  res.header({ Authorization: jwt });
  res.send();
});

export default router;
