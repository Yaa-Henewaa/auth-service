import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import { AuthSchema } from "./auth.schema";
import { Request, Response } from "express";
import { createAccount } from "./auth.service";
import { CREATED } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";

export default class AuthController {
  static registerHandler = catchErrors(async function (
    req: Request<{}, {}, z.infer<typeof AuthSchema.register>>,
    res: Response
  ) {
    // Validate the request body
    const { email, password, confirmPassword, userAgent } =
      AuthSchema.validateRegister(req.body);

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Create the user account
    const { user, accessToken, refreshToken } = await createAccount({
      email,
      password,
      userAgent,
    });

    // Set authentication cookies
    setAuthCookies({ res, accessToken, refreshToken });

    return res.status(CREATED).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  });
}

export const registerHandler = catchErrors(async (req, res) => {
  //validate request
  //call service
  //return response
});
