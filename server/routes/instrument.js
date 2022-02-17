import express from 'express';

import { getInstruments, createInstrument, deletePost } from '../controllers/instrument.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/',  getInstruments);
router.post('/', auth, createInstrument);
router.delete('/:id', auth, deletePost);

export default router;