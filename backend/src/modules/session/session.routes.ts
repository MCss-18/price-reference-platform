import { Router } from "express";
import { sessionController } from "./session.module";

const sessionRoutes = Router();

sessionRoutes.get("/all", sessionController.findAllSessionsActive);
sessionRoutes.get("/", sessionController.findById);
sessionRoutes.delete("/:sessionId", sessionController.deleteById);

export default sessionRoutes;