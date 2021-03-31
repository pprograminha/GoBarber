import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";
interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}
export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) throw new AppError("JWT token is missing.", 401);

  const [, token] = authorization.split(" ");

  if (!token) throw new AppError("JWT token is missing.", 401);
  const { secret } = authConfig.jwt;
  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub,
    };
    next();
  } catch {
    throw new AppError("Invalid JWT token", 401);
  }
}