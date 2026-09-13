import { test, expect, beforeEach, describe } from "@playwright/test";

const apiUrl = "http://localhost:8000";

const users = {
  first: {
    username: "testuser",
    password: "password",
    name: "Test User",
  },
  second: {
    username: "seconduser",
    password: "password",
    name: "Second User",
  },
};

const createUser = async (request, user) => {
  const response = await request.post(`${apiUrl}/api/users`, {
    data: user,
  });

  expect(response.ok()).toBeTruthy();
};

const login = async (page, username, password) => {
  await page.getByLabel("username:").fill(username);
  await page.getByLabel("password:").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const loginAsFirstUser = async (page) => {
  await page.getByRole("link", { name: "login" }).click();
  await login(page, users.first.username, users.first.password);
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("link", { name: "new blog" }).click();

  await page.getByLabel("title:").fill(title);
  await page.getByLabel("author:").fill(author);
  await page.getByLabel("url:").fill(url);

  await page.getByRole("button", { name: "create", exact: true }).click();

  await expect(page.getByRole("link", { name: title })).toBeVisible();
};

const openBlog = async (page, title) => {
  await page.getByRole("link", { name: title, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    const reset = await request.post(`${apiUrl}/api/testing/reset`);
    expect(reset.ok()).toBeTruthy();

    await createUser(request, users.first);
    await createUser(request, users.second);

    await page.goto("/");
  });

  describe("Login", () => {
    test("login succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();

      await login(page, users.first.username, users.first.password);

      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();

      await expect(page.getByText("Test User")).toBeVisible();
    });

    test("login fails with wrong credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();

      await login(page, users.first.username, "wrong-password");

      await expect(page.getByText("wrong username or password")).toBeVisible();

      await expect(
        page.getByRole("heading", {
          name: /log in to application/i,
        }),
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginAsFirstUser(page);
    });

    test("a logged-in user can create a blog", async ({ page }) => {
      await createBlog(
        page,
        "A Playwright Blog",
        "Ganesh",
        "https://example.com",
      );

      await expect(
        page.getByRole("link", { name: "A Playwright Blog", exact: true }),
      ).toBeVisible();
    });

    test("a logged-in user can like a blog", async ({ page }) => {
      await createBlog(page, "Likeable Blog", "Ganesh", "https://example.com");

      await openBlog(page, "Likeable Blog");

      await expect(page.locator(".likes")).toHaveText("likes 0");

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.locator(".likes")).toHaveText("likes 1");
    });

    test("a logged-in user can delete a blog", async ({ page }) => {
      await createBlog(page, "Delete Me", "Ganesh", "https://example.com");

      await openBlog(page, "Delete Me");

      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
      });

      await page.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByRole("link", { name: "Delete Me", exact: true }),
      ).not.toBeVisible();
    });

    test("only the creator sees the delete button", async ({
      page,
      request,
    }) => {
      await createBlog(
        page,
        "Owner Only Blog",
        "Ganesh",
        "https://example.com",
      );

      await openBlog(page, "Owner Only Blog");

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await page.getByRole("link", { name: "login" }).click();

      await login(page, users.second.username, users.second.password);

      await openBlog(page, "Owner Only Blog");

      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("blogs are sorted according to likes", async ({ page }) => {
      await createBlog(
        page,
        "Blog With One Like",
        "Ganesh",
        "https://one.example.com",
      );

      await createBlog(
        page,
        "Blog With Three Likes",
        "Ganesh",
        "https://three.example.com",
      );

      await createBlog(
        page,
        "Blog With Two Likes",
        "Ganesh",
        "https://two.example.com",
      );

      // Give the first blog 1 like
      await openBlog(page, "Blog With One Like");

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.locator(".likes")).toHaveText("likes 1");

      await page.goto("/");

      // Give the second blog 3 likes
      await openBlog(page, "Blog With Three Likes");

      const likeButton = page.getByRole("button", { name: "like" });

      await likeButton.click();
      await likeButton.click();
      await likeButton.click();

      await expect(page.locator(".likes")).toHaveText("likes 3");

      await page.goto("/");

      // Give the third blog 2 likes
      await openBlog(page, "Blog With Two Likes");

      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();

      await expect(page.locator(".likes")).toHaveText("likes 2");

      await page.goto("/");

      const blogLinks = page.locator('a[href^="/blogs/"]');

      await expect(blogLinks).toHaveText([
        "Blog With Three Likes",
        "Blog With Two Likes",
        "Blog With One Like",
      ]);
    });
  });
});
