import { generateTemplate } from "#/mail/template";
import path from "path";
import { MAILTRAP_USER, MAILTRAP_PASS, VERIFICATION_EMAIL } from "./variables";
import nodemailer from 'nodemailer'
import EmailVerificationToken from "#/models/emailVerificationToken";
const generateMailTransporter = () =>{
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS,
      },
    });
    return transport;
}

//token = 6 digit otp => 125445 => send  //we will use these
//token = attach these tokens to the <a href = "yoururl/token=slkfjas"  ==> verify


interface Profile{
    name:string,
    email:string,
    userId:string
}
//send verification email

export const sendVerificationMail = async(token:string,profile:Profile)=>{
const {name,email,userId} = profile;
await EmailVerificationToken.create({
  owner: userId,
  token,
  createdAt: Date.now(),
});

const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;
const transport = generateMailTransporter();
transport.sendMail({
  to: email,
  from: VERIFICATION_EMAIL,
  subject: "Welcome message",
  // html: `<h1>Your verification token is ${token}</h1>`
  html: generateTemplate({
    title: "Welcome to podify",
    message: welcomeMessage,
    logo: "cid:logo",
    banner: "cid:welcome",
    link: "#",
    btnTitle: token,
  }),
  attachments: [
    {
      filename: "logo.png",
      path: path.join(__dirname, "../mail/logo.png"), //used absolute path of the computer
      cid: "logo",
    },
    {
      filename: "welcome.png",
      path: path.join(__dirname, "../mail/welcome.png"), //used absolute path of the computer
      cid: "welcome",
    },
  ],
});

}
