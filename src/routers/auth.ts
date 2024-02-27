import { Router } from "express";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  updatePasswordSchema,
} from "#/utils/validationSchema";
import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendVerificationToken,
  signIn,
  updatePassword,
} from "#/controllers/user";
import { verifyEmail } from "#/controllers/user";
import { isValidPasswordResetToken, mustAuth } from "#/middleware/auth";
import { RequestWithFiles, fileParser } from "#/middleware/fileParser";
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
router.post("/sign-in", validate(SignInValidationSchema), signIn);

router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});
// router.get('/public',(req,res)=>{
//   res.json({
//     message: "You are in public route"
//   })
// })
// router.get('/private',mustAuth,(req,res)=>{
//   res.json({
//     message: "You are in private route",
//   });
// })


//to upload files on express server using formidable //this process is totally unscalable
// import formidable from "formidable";
// import path from 'path'; 
// import fs from 'fs';
// router.post("/update-profile", async(req, res) => {
//   if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
//     return res.status(422).json({ error: "Only accepts form-data!" });
//   const dir = path.join(__dirname,"../public/profiles");
//   try{
//     await fs.readFileSync(dir)
//   }catch(error){   //if there is no folder throw an error
//     await fs.mkdirSync(dir) //this time we are making the profiles directory inside public folder
//   }
//   //handle the file upload
//   const form = formidable({
//     uploadDir:dir,
//     filename(name,ext,part,form){
//       return Date.now()+"_"+part.originalFilename
//     }
//   });
//   form.parse(req, (err, fields, files) => {
//     // console.log("fields: ", fields);
//     // console.log("files: ", files);
//     res.json({ uploaded: true });
//   });
// });

router.post("/update-profile",fileParser,(req:RequestWithFiles,res)=>{
  console.log(req.files);
  res.json({ok:true})
})


export default router;
