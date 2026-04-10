import { Router } from "express";
import { serviceController } from "./service.module";

const serviceRoutes = Router();

serviceRoutes.get("/", serviceController.findPaginatedAndCount);

export default serviceRoutes;