import { Router } from 'express';
import Comment from '../models/comment.js';
import { jwtVerify } from 'jose';
import { secret } from './challenges.js';

const router = Router();

router.post('/', async (req, res, next) => {
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
    res.sendStatus(422);
    return;
  }
  res.status(201).send(newComment);
});

router.get('/', async (req, res, next) => {
  res.send(await Comment.findAll());
});

export default router;
