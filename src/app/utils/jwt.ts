

import { JwtPayload, SignOptions } from "jsonwebtoken";
import  Jwt  from "jsonwebtoken";

export const generateToken = (payload : JwtPayload,secret:string,expiresIn:string) =>{
    const token = Jwt.sign(payload,secret,{
        expiresIn
    } as SignOptions)
    return token
}

export const verifyToken = (accessToken : string,secret:string) =>{
  const verifiedToken = Jwt.verify(accessToken,secret)
  return verifiedToken
}