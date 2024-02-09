import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import { requiresAuth } from "./middleware/auth";
import productsRoutes from "./routes/products";
import usersRoutes from "./routes/users";
import env from "./util/validateEnv";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URI,
    }),
  })
);

app.use("/api/users", usersRoutes);
app.use("/api/products", requiresAuth, productsRoutes);

app.use((req, res, next) => {
  next(new Error("Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknow error has ocurred";
  if (error instanceof Error) {
    errorMessage = Error.arguments;
  }
  res.json({ error: errorMessage });
});

export default app;
