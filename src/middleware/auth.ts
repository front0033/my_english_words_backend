import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

export default function (req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const cookies = cookie.parse(req.headers.cookie || "");
  const { access_token } = cookies;

  // Check if no token
  if (!access_token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(
      access_token,
      config.get("jwtSecret")
    );
    req.userId = payload.userId;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}
