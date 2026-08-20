import express from "express";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken'

const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name:1,username:1,_id:0})
  res.json(blogs)
});

blogsRouter.post("/", async (req, res) => {
  const authorization=req.get('authorization')

  if(!authorization|| !authorization.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({
      error: 'token missing'
    })
  }

  const token = authorization.substring(7)

  const decodedToken = jwt.verify(
    token,
    process.env.SECRET
  )

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  res.status(201).json(savedBlog)
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return response.status(404).end();
  }

  response.json(blog);
});

export default blogsRouter;
