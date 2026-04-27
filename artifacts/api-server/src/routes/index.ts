import { Router, type IRouter } from "express";
import healthRouter from "./health";
import characterRouter from "./character";
import shipRouter from "./ship";
import authRouter from "./auth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(characterRouter);
router.use(shipRouter);
router.use(adminRouter);

export default router;
