import { Router } from 'express';
import { confirmController } from '../controllers/confirmController';

const router = Router();

router.patch('/', confirmController);

export default router;
