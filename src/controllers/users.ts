import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import Users from "../models/users.model";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await Users.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw new Error("Parameters missing");
    }

    const existingUsername = await Users.findOne({ username: username }).exec();

    if (existingUsername) {
      throw new Error(
        "Username already taken. Choose a different one or log in instead."
      );
    }

    const existingEmail = await Users.findOne({ email: email }).exec();

    if (existingEmail) {
      throw new Error(
        "A user with this email address already exists. Please log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await Users.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface SignInBody {
  username?: string;
  password?: string;
}

export const signIn: RequestHandler<
  unknown,
  unknown,
  SignInBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw new Error("Parameters missing");
    }

    const user = await Users.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
