import { generateTemplate } from "#/mail/template";
import path from "path";
import { MAILTRAP_USER, MAILTRAP_PASS, VERIFICATION_EMAIL, SIGN_IN_URL } from "./variables";
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

interface Options{
  email:string,
  link: string
}

export const sendForgetPasswordLink = async(options:Options)=>{
const {email,link} = options;

const message = "We just received a request that you forget your password. No problem you can use the link below and create brand new password.";
const transport = generateMailTransporter();
transport.sendMail({
  to: email,
  from: VERIFICATION_EMAIL,
  subject: "Reset Password Link",
  // html: `<h1>Your verification token is ${token}</h1>`
  html: generateTemplate({
    title: "Forget Password",
    message,
    logo: "cid:logo",
    banner: "cid:forget_password",
    link,
    btnTitle: "Reset Password",
  }),
  attachments: [
    {
      filename: "logo.png",
      path: path.join(__dirname, "../mail/logo.png"), //used absolute path of the computer
      cid: "logo",
    },
    {
      filename: "forget_password.png",
      path: path.join(__dirname, "../mail/forget_password.png"), //used absolute path of the computer
      cid: "forget_password",
    },
  ],
});

}
export const sendPassResetSuccessEmail = async (name:string,email:string) => {
  const message =
    `Dear ${name} we just updated your new password. You can now sign in with your new password`;
  const transport = generateMailTransporter();
  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Password Successfully",
    // html: `<h1>Your verification token is ${token}</h1>`
    html: generateTemplate({
      title: "Reset Password Successfully",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"), //used absolute path of the computer
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"), //used absolute path of the computer
        cid: "forget_password",
      },
    ],
  });
};
