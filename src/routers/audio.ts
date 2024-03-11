import { createAudio, updateAudio } from "#/controllars/audio";
import { isVerified, mustAuth } from "#/middleware/auth";
import { fileParser } from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import { AudioValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();
router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
); //create new audio // upload to cloudinary
router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  updateAudio
); //update every thing about audio except except audio file
export default router;
