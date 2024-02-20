import { Router } from "express";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  TokenAndIDValidation,
  updatePasswordSchema,
} from "#/utils/validationSchema";
import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendVerificationToken,
  updatePassword,
} from "#/controllers/user";
import { verifyEmail } from "#/controllers/user";
import { isValidPasswordResetToken } from "#/middleware/auth";
const router = Router();

router.post("/create", validate(CreateUserSchema), create); //create new user and send to token to mail and save encrypt token to Database temporarily
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail); //verify user input token and Database token for the perticular user securely by using bcript // and delete the token from DB
router.post("/re-verify-email", sendVerificationToken); //to reVerify email //process similar to "/create" but this process only for valid user(already have account)
router.post("/forget-password", generateForgetPasswordLink); //generate random token using crypto and send it to user resistered mail
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(updatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
export default router;
