import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";
import { getBlogById } from "../services/blogs.js";

const Blog = ({ updateBlogpost, deleteBlogpost, currentUser }) => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogData = await getBlogById(id);
      setBlog(blogData);
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>loading...</div>;
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user?._id,
    };

    const result = await updateBlogpost(updatedBlog);

    setBlog(result);
  };

  const handleDelete = async () => {
    const confirmMsg = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );

    if (confirmMsg) {
      await deleteBlogpost(blog.id);
    }
  };

  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user.id === currentUser.id ||
      blog.user._id === currentUser.id);

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 5,
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        {blog.title}{" "}
      </Typography>
      ```
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        by {blog.author}
      </Typography>
      <MuiLink
        href={blog.url}
        target="_blank"
        rel="noreferrer"
        sx={{
          display: "block",
          mb: 3,
          fontSize: "1.1rem",
        }}
      >
        {blog.url}
      </MuiLink>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Chip label={`likes ${blog.likes}`} className="likes" />

        {currentUser && (
          <Button variant="contained" onClick={handleLike}>
            like
          </Button>
        )}
      </Box>
      <Typography sx={{ mb: 3 }}>added by {blog.author}</Typography>
      {isOwner && (
        <Button variant="outlined" color="error" onClick={handleDelete}>
          remove
        </Button>
      )}
      <Box sx={{ mt: 4 }}>
        <Button component={Link} to="/" variant="text">
          back to blogs
        </Button>
      </Box>
    </Paper>
  );
};

export default Blog;
