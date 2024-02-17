import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import { RequestHandler, Response } from "express";
export const create = async (req: CreateUser, res: Response) => {
  const { email, password, name } = req.body;
  const user = await User.create({ name, email, password });

  const token = generateToken();
  sendVerificationMail(token,{name,email,userId:user._id.toString()})
  res.json({ user:{id:user._id,name,email} });
};
export const verifyEmail:RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
  const { token,userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner:userId
  })
  if(!verificationToken) return res.status(403).json({error:"Invalid token!"})
  const matched = verificationToken.compareToken(token)
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId,{
    verified:true
  })
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
  res.json({message:"Your email is verified."})
};
