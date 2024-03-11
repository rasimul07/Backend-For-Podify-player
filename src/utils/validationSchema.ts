import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./audio_category";
export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing!!")
    .min(3, "Name is too short!!")
    .max(20, "Name is too long!"),
  email: yup.string().required("Email is missing!").email("Invalid email"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password is too simple"
    ),
});

// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test("Rasimul@29928")    // run at browser console

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        //here this.isType(value) means value type is string //isValidObjectId means to check valid objectId in mongodb collection
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});
export const updatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        //here this.isType(value) means value type is string //isValidObjectId means to check valid objectId in mongodb collection
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password is too simple"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup.string().trim().required("Password is missing!"),
});
export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().trim().required("About is missing!"),
  category: yup.string().trim().oneOf(categories,"Invalid category!").required("Category is missing!")
});

