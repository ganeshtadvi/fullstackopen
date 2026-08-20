import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from 'jsonwebtoken'

const usersRouter = express.Router();




usersRouter.get("/", async (request, response) => {
  const users = await User.find().populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({
      error: "username must be at least 3 characters",
    });
  }

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: "password must be at least 3 characters",
    });
  }

  const userExist=await User.findOne({username})

  if(userExist){
    return res.status(400).json({
      error:"Username must be Unique"
    })
  }

  const passwordHash = await bcrypt.hash(password, 10);

const user=new User({
  username,name,passwordHash
})

const savedUser=await user.save()

res.status(201).json(savedUser)

});



export default usersRouter;
