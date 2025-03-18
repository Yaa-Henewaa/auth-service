import {CookieOptions,Response} from "express"
import { fifteenMinutesFromNow } from "../utils/date";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
    sameSite:"strict",
    httpOnly:true,
    secure:true
}

const getAccessTokenCookieOptions=(): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
})
const getRefreshTokenCookieOptions=(): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
    path: "/auth/refresh",
})

type Params ={
    res:Response;
    accessToken :string;
    refreshToken: string;
}

export const setAuthCookies = ({res,accessToken,refreshToken}:Params) =>
    res.cookie("accessToken",accessToken,getAccessTokenCookieOptions()).cookie("refreshToken",refreshToken,getRefreshTokenCookieOptions());