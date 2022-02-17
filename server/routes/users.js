import express from 'express';

const router = express.Router();

import { signin, signup, getUsers, depositMoney, buyInstrument, sellInstrument, getUser } from '../controllers/users.js';

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/", getUsers);
router.get("/user/:id", getUser);
router.patch("/deposit/:id", depositMoney);
router.patch("/buy/:id",  buyInstrument);
router.patch("/sell/:id",  sellInstrument);

export default router;