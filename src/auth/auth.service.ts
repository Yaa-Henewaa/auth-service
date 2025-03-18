import { TokenExpiredError } from "jsonwebtoken";
import { CreateAccountParams } from "./auth.entities";
import UserModel from "../users/user.model";
import VerificationCodeModel from "../users/verificationCode.model";
import VerificationCodeType from "../constants/verificationCodeTypes";
import { oneYearFromNow } from "../utils/date";
import SessionModel from "../models/session.model";
import { JWT_REFRESH_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import CustomError from "../constants/custom_error";

export const createAccount = async (data: CreateAccountParams) => {
  //verify user
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  if (existingUser) {
    throw new CustomError(409,"User already exists");
  }

  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  //create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow()
  })

  //send verification email


  // create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  })

  // sign access token & refresh Token
  const refreshToken = jwt.sign(
    {sessionId:session._id},
    JWT_REFRESH_SECRET,
    {
        audience: ["user"],
        expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
        userId: user._id,
        sessionId:session._id},
    JWT_REFRESH_SECRET,
    {
        audience: ["user"],
        expiresIn: "15m",
    }
  );
  //return user & tokens
  return{
    user,
    accessToken,
    refreshToken
  }
};
