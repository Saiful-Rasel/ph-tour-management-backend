import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";

import { checkAuth } from "../../middleware/checkAuth";
import { object } from "zod";


 const router = Router()
 
router.post('/register',validateRequest(createUserZodSchema), userControllers.createUser)
router.get('/all-users', checkAuth(Role.ADMIN,Role.SUPER_ADMIN),userControllers.getAllUser)
router.patch('/:id',validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),userControllers.updateUser)

export const userRoutes = router
