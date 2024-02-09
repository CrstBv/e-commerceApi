import { RequestHandler } from "express";

export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(Error("User not authenticated"));
  }
};
