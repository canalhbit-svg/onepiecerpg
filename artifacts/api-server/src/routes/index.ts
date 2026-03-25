import { Router, type IRouter } from "express";
import healthRouter from "./health";
import characterRouter from "./character";
import shipRouter from "./ship";

const router: IRouter = Router();

router.use(healthRouter);
router.use(characterRouter);
router.use(shipRouter);

export default router;
