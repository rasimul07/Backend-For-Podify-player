import { Router } from "express";
import { validate } from "#/middleware/validator";
import { CreateUserSchema } from "#/utils/validationSchema";
import { create } from "#/controllers/user";
import { verifyEmail } from "#/controllers/user";
const router = Router();

router.post('/create',validate(CreateUserSchema),create)
router.post('/verify-email',verifyEmail)
export default router;