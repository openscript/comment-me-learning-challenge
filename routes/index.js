import { Router } from 'express';
import { configuration } from '../conf.js';
const router = Router();

router.get('/', (req, res, next) => {
  res.render('index', { address: configuration.address });
});

export default router;
