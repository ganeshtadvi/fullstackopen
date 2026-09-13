import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

const BlogForm = ({ handleBlogSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    await handleBlogSubmit(newBlog);

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create new blog
        </Typography>

        <Box
          component="form"
          onSubmit={addBlog}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="title:"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <TextField
            label="author:"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />

          <TextField
            label="url:"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />

          <Button type="submit" variant="contained">
            create
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogForm;
