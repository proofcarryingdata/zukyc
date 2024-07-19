import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const handleLogin = (
  req: Request,
  res: Response,
  privateKey: string
) => {
  const inputs: { email: string; password: string } = req.body;

  if (!inputs.email || !inputs.password) {
    res.status(400).send("Missing query parameter");
    return;
  }

  // In practice, get user information from database by email,
  // Here for demo purposes, we'll allow any email with @zoo.com domain
  if (!inputs.email.endsWith("@zoo.com")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // In practice, check if the encrypted password match
  // This is just for demo purposes
  if (!inputs.password.startsWith("zoo")) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // Signing JWT, valid for 1 hour
  const token = jwt.sign({ email: inputs.email }, privateKey, {
    algorithm: "HS512",
    expiresIn: "1h"
  });
  res.send(token);
};
