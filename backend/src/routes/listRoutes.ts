import { Router } from 'express';
import { listMeasuresController } from '../controllers/listMeasuresController';

const router = Router();

router.get('/:customer_code/list', listMeasuresController);

export default router;
