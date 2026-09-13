import { test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Blog from "./Blog";
import { getBlogById } from "../services/blogs.js";

vi.mock("../services/blogs.js", () => ({
  getBlogById: vi.fn(),
}));

const blog = {
  id: "1",
  title: "Testing React applications",
  author: "Ganesh",
  url: "https://example.com",
  likes: 5,
  user: {
    id: "user1",
    username: "ganesh",
  },
};

const renderBlog = (currentUser) => {
  getBlogById.mockResolvedValue(blog);

  render(
    <MemoryRouter initialEntries={["/blogs/1"]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              currentUser={currentUser}
              updateBlogpost={vi.fn()}
              deleteBlogpost={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

test("unauthenticated user sees blog information but no buttons", async () => {
  renderBlog(null);

  await waitFor(() => {
    expect(screen.getByText("Testing React applications")).toBeInTheDocument();
  });

  expect(screen.getByText("https://example.com")).toBeInTheDocument();
  expect(screen.getByText("5")).toBeInTheDocument();
  expect(screen.getByText("added by Ganesh")).toBeInTheDocument();

  expect(screen.queryByText("like")).not.toBeInTheDocument();
  expect(screen.queryByText("remove")).not.toBeInTheDocument();
});

test("authenticated non-owner sees only the like button", async () => {
  const currentUser = {
    id: "user2",
    username: "anotheruser",
  };

  renderBlog(currentUser);

  await waitFor(() => {
    expect(screen.getByText("Testing React applications")).toBeInTheDocument();
  });

  expect(screen.getByText("like")).toBeInTheDocument();
  expect(screen.queryByText("remove")).not.toBeInTheDocument();
});

test("blog creator sees the delete button", async () => {
  const currentUser = {
    id: "user1",
    username: "ganesh",
  };

  renderBlog(currentUser);

  await waitFor(() => {
    expect(screen.getByText("Testing React applications")).toBeInTheDocument();
  });

  expect(screen.getByText("like")).toBeInTheDocument();
  expect(screen.getByText("remove")).toBeInTheDocument();
});
