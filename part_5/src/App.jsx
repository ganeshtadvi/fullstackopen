import "./index.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Paper,
} from "@mui/material";

import Blog from "./components/Blog.jsx";
import { getAll, addBlog, updateBlog, deleteBlog } from "./services/blogs.js";
import loginService from "./services/login.js";
import Notification from "./components/Notification.jsx";
import BlogFrom from "./components/BlogForm.jsx";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loggedUser = await loginService({
        username,
        password,
      });

      setNotification("success");
      setMsg("logging successfully");

      setTimeout(() => {
        setNotification(null);
        setMsg(null);
      }, 5000);

      window.localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

      setUser(loggedUser);

      const blogs = await getAll();
      setBlogs(blogs);

      navigate("/");
    } catch (err) {
      console.log(err);

      setNotification("failed");
      setMsg("wrong username or password");

      setTimeout(() => {
        setNotification(null);
        setMsg(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedInUser");

    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }

    const fetchBlogs = async () => {
      const blogs = await getAll();
      setBlogs(blogs);
    };

    fetchBlogs();
  }, []);

  const handleBlogSubmit = async (newBlog) => {
    const blogSubmit = await addBlog(newBlog, user.token);

    setBlogs(blogs.concat(blogSubmit));

    setNotification("success");
    setMsg(`a new blog ${newBlog.title} by ${newBlog.author} added`);

    setTimeout(() => {
      setNotification(null);
      setMsg(null);
    }, 2000);

    navigate("/");
  };

  const updateBlogpost = async (blogObject) => {
    const updatedBlog = await updateBlog(blogObject, user.token);

    setBlogs(
      blogs.map((blog) =>
        blog.id === updatedBlog.id
          ? { ...updatedBlog, user: updatedBlog.user || blog.user }
          : blog,
      ),
    );

    return updatedBlog;
  };

  const deleteBlogpost = async (id) => {
    await deleteBlog(id, user.token);
    setBlogs(blogs.filter((blog) => blog.id !== id));
    navigate("/");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Blog App
          </Typography>

          <Button component={Link} to="/" color="inherit">
            blogs
          </Button>

          {!user && (
            <Button component={Link} to="/login" color="inherit">
              login
            </Button>
          )}

          {user && (
            <>
              <Button component={Link} to="/create" color="inherit">
                new blog
              </Button>

              <Button onClick={handleLogout} color="inherit">
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Notification msg={msg} notificationType={notification} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Typography variant="h3" sx={{ mt: 4, mb: 3 }}>
                  blogs
                </Typography>

                {blogs
                  .slice()
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Paper
                      key={blog.id}
                      elevation={2}
                      sx={{
                        p: 2,
                        mb: 1,
                      }}
                    >
                      <Link
                        to={`/blogs/${blog.id}`}
                        style={{
                          textDecoration: "none",
                          fontSize: "1.1rem",
                        }}
                      >
                        {blog.title}
                      </Link>
                    </Paper>
                  ))}
              </>
            }
          />

          <Route
            path="/login"
            element={
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 450,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Log in to application
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="username:"
                      value={username}
                      onChange={({ target }) => setUsername(target.value)}
                    />

                    <TextField
                      label="password:"
                      type="password"
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                    />

                    <Button type="submit" variant="contained">
                      login
                    </Button>
                  </Box>
                </Paper>
              </Box>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <Blog
                currentUser={user}
                updateBlogpost={updateBlogpost}
                deleteBlogpost={deleteBlogpost}
              />
            }
          />

          <Route
            path="/create"
            element={<BlogFrom handleBlogSubmit={handleBlogSubmit} />}
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
