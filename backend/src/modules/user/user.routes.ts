import { Router } from "express";
import { userController } from "./user.module";

const userRoutes = Router();

userRoutes.get("/:userId", userController.findById);

export default userRoutes;