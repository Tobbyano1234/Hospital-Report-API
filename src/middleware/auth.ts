import express, { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export async function auth(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.token;
    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({
        Error: "Kindly sign in as a Doctor",
      });
      return;
    }

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ Error: "Doctor not verify, you can access this route" });
    }

    // req.user = verified;
    next();
  } catch (error) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ Error: "Doctor is not not logged in" });
  }
}
