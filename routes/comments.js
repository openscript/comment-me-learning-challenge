import { Router } from 'express';
import Comment from '../models/comment.js';
import { jwtVerify } from 'jose';
import { secret } from './challenges.js';
import { rateLimiter, RateLimiterConfig } from '../middleware/rateLimiter.js';

const router = Router();

const limiterConfig = new RateLimiterConfig({
  windowMs: 60000, // 1 minute
  max: 5,         // 5 requests per window
  blockMs: 300000, // 5 minutes block
  maxBeforeBlock: 2 // 2 windows before block
});
router.post('/', rateLimiter(limiterConfig), async (req, res, next) => {
  let level = 0;
  try {
    const { payload } = await jwtVerify(req.header('Authorization'), secret);
    level = parseInt(payload.challenge);
  } catch (error) {
    res.sendStatus(403);
    return;
  }
  const origin = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const newComment = Comment.build({ ...req.body, origin });
  try {
    await newComment.save();
  } catch (error) {
    res.status(422);
    res.send(error);
    return;
  }
  res.status(201).send(newComment);
});

router.get('/', async (req, res, next) => {
  res.send(await Comment.findAll());
});

export default router;
