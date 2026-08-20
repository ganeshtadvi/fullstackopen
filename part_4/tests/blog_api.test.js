import app from "../app.js";
import mongoose from "mongoose";
import supertest from "supertest";
import { test, describe, beforeEach, after } from "node:test";
import assert from "node:assert";
import Blog from "../models/blog.js";

const api = supertest(app);

const initialBlogs = [
  {
    title: "React is great",
    author: "Ganesh",
    url: "https://example.com/react",
    likes: 5, 
  },
  {
    title: "Node.js basics",
    author: "John",
    url: "https://example.com/node",
    likes: 10,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blogs have id property", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  assert(blogs.every((blog) => blog.id));
});



test('a blog can be added', async () => {
  const blogsAtStart = await Blog.find({})

  const loggedUser = await api
    .post('/api/login')
    .send({
      username: 'xgxgxgxg',
      password: '1211212'
    })

  const newBlog = {
    title: 'Testing with SuperTest',
    author: 'rahul',
    url: 'https://imrahul.in/testing',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${loggedUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(
    blogsAtEnd.length,
    blogsAtStart.length + 1
  )
})


  test('blog without title is not added', async () => {
    const newBlog = {
      title:"MY BOok",
      author: 'Ganesh',
      url: 'https://imganesh.com/test',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })


  test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await Blog.find({})
  
    const ids = blogsAtEnd.map(blog => blog.id)
  
    assert(!ids.includes(blogToDelete.id))
  
    assert.strictEqual(
      blogsAtEnd.length,
      blogsAtStart.length - 1
    )
  })




  test('a blog can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
  
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await Blog.find({})
  
    const updatedBlogInDb = blogsAtEnd.find(
      blog => blog.id === blogToUpdate.id
    )
  
    assert.strictEqual(
      updatedBlogInDb.likes,
      blogToUpdate.likes + 1
    )
  })


