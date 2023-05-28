import express from "express";
import mongoose from "mongoose";
import {
  loginValidate,
  postCreateValidation,
  userDataValidate,
} from "./validations/validation.js";
import { protect, validateMiddleware } from "./middelware/index.js";
import { authControllers, postController } from "./controllers/index.js";
import multer from "multer";
import cors from "cors";
import fs from 'fs';

mongoose
  .connect(
    "mongodb+srv://Diana:Diana123@cluster0.gtihdk7.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok connect");
  })
  .catch(() => {
    console.log("DB error");
  });

const app = express();

//UPLOAD IMAGES

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.post('/upload', protect, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
//register
app.post(
  "/auth/register",
  userDataValidate,
  validateMiddleware,
  authControllers.register
);

//login

app.post(
  "/auth/login",
  loginValidate,
  validateMiddleware,
  authControllers.login
);

//get profile
app.get("/auth/me", protect, authControllers.getMe);

//POSTS

app.post(
  "/posts",
  protect,
  postCreateValidation,
  validateMiddleware,
  postController.createPost
);

app.get("/posts", postController.getPosts);
app.get("/posts/:id", postController.getOnePost);
app.delete("/posts/:id", protect, postController.deletePost);
app.patch(
  "/posts/:id",
  protect,
  postCreateValidation,

  postController.updatePost
);

//TAGS
app.get("/tags", postController.getLastTags);

//COMMETS

app.post(
  "/comments",
  protect,
  postController.createComment
);

app.get(
  "/comments",
  postController.getComments
);

app.listen(9832, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server start at port 9832");
});
