import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendForgetPasswordLink, sendPassResetSuccessEmail, sendVerificationMail } from "#/utils/mail";
import { RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from 'crypto';
import { PASSWORD_RESET_LINK } from "#/utils/variables";
export const create = async (req: CreateUser, res: Response) => {
  const { email, password, name } = req.body;
  const user = await User.create({ name, email, password });

  const token = generateToken();
   await EmailVerificationToken.create({
     owner: user._id,
     token,
   });
  sendVerificationMail(token, { name, email, userId: user._id.toString() });
  res.json({ user: { id: user._id, name, email } });
};
export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res: Response
) => {
  const { token, userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });
  const matched = verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
  res.json({ message: "Your email is verified." });
};
export const  sendVerificationToken: RequestHandler = async (
  req: VerifyEmailRequest,
  res: Response
) => {
  const { userId } = req.body;
  
  if(!isValidObjectId(userId)) return res.status(403).json({error: "Invalid request!"})

  //first all we have to check valid user or not
  const user = await User.findById(userId);
  if(!user) return res.status(403).json({error: "Invalid request!! User not exists!!"})
  //any token already exist first remove it
  await EmailVerificationToken.findOneAndDelete({
    owner:userId
  })
  const token = generateToken()
  await EmailVerificationToken.create({
    owner:userId,
    token
  })

  sendVerificationMail(token,{
    name:user?.name,
    email:user?.email,
    userId:user?._id.toString()
  })

  res.json({message:"Please check your mail."})
};


export const generateForgetPasswordLink:RequestHandler = async(req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({error: "Account not found"})

   //if the user have passwordResetToken already
   await PasswordResetToken.findOneAndDelete({
    owner:user._id
   })
  //generate the link
  //https://yourapp.com/reset-password?token=hasdlfkasjdas&userId=34095ksdjfsjds
  const token = crypto.randomBytes(36).toString('hex');
  await PasswordResetToken.create({
    owner: user._id,
    token
  })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`
  sendForgetPasswordLink({email: user.email,link:resetLink})
  res.json({message:"Check your registered mail."})
}
export const grantValid:RequestHandler = async(req,res)=>{
 res.json({valid:true})
}
export const updatePassword: RequestHandler = async (req, res) => {
  const {password,userId} = req.body;
  const user = await User.findById(userId);
  if(!user) return res.status(403).json({error: "Unauthorized access"})

  const matched = await user.comparePassword(password);
  if(matched) return res.status(422).json({error:"The new password must be different"})
  user.password = password
  await user.save()

  await PasswordResetToken.findOneAndDelete({owner: user._id});

  //send the success email
  sendPassResetSuccessEmail(user.name,user.email);
  res.json({message: "Password reset successfully."})
};



