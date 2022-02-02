import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IGetUserAuthInfoRequest extends Request {
  user: JwtPayload;
}

interface IVerifyClientInfo {
  origin: string;
  secure: boolean;
  req: IGetUserAuthInfoRequest;
}

export default IVerifyClientInfo;
