import { Date, Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
interface passwordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<
  passwordResetTokenDocument,
  {},
  Methods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //60min * 60 sec = 3600s
    default: Date.now,
  },
});

PasswordResetTokenSchema.pre("save", async function (next) {
  //hash the token
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

PasswordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token); //compare(realtoken,encryptedToken) //here token refers OTP
  return result;
};
export default model("PasswordResetToken", PasswordResetTokenSchema) as Model<
  passwordResetTokenDocument,
  {},
  Methods
>;
