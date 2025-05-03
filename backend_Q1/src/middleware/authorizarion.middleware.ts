import { Request, Response, NextFunction } from "express";
import { setAuthToken } from "../lib/api.js";

export function authorization(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }
  setAuthToken(auth);
  next();
}
