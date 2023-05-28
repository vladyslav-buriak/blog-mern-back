import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../../models/User.js";


//REGISTER
export const register = async (req, resp) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      hash: passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, "j#ghf#jdhsfk#33", {
      expiresIn: "30d",
    });
    const { hash, ...userInfo } = user._doc;

    resp.json({ ...userInfo, token });
  } catch (err) {
    resp.status(500).json({
      message: "не вдалось зареэструваатись",
    });
  }
};

//LOGIN
export const login = async (req, resp) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return resp.status(401).json({
        message: "логін або пароль не корректні",
      });
    }

    const isPassMatch = await bcrypt.compare(req.body.password, user._doc.hash);

    if (!isPassMatch) {
      return resp.status(401).json({
        message: "логін або пароль не корректні",
      });
    }

    const token = jwt.sign({ _id: user._id }, "j#ghf#jdhsfk#33", {
      expiresIn: "30d",
    });
    const { hash, ...userInfo } = user._doc;
    resp.json({ ...userInfo, token });
    console.log(token)
  } catch (err) {
    console.log(err);
    resp.status(400).json({
      message: "сталась помилка!",
    });
  }
};


//GET ME
export const getMe = async (req, resp) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return resp.status(404).json({
        message: "корістувача не знайдено",
      });
    }
    const { hash, ...userInfo } = user._doc;

    resp.json({ ...userInfo });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "сталась помилка!",
    });
  }

}