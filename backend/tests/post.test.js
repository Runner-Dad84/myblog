// tests/postCreate.test.js
const request = require("supertest");
const express = require("express");

// Mock prisma
jest.mock("../prismaClient", () => ({
  post: {
    create: jest.fn(),
  },
}));

const prisma = require("../prismaClient");
const postRouter = require("../routes/postRouter");

// helper to create an Express app with optional authentication
function createApp(withAuth = false) {
  const app = express();
  app.use(express.json());

  if (withAuth) {
    app.use((req, res, next) => {
      req.user = { id: 123 }; // mock logged-in user
      next();
    });
  }

  app.use("/", postRouter);
  return app;
}

// -------------------------------
// TESTS
// -------------------------------

describe("POST /post/create", () => {
  it("creates a new post successfully when authenticated", async () => {
    const app = createApp(true); // authenticated app

    // Mock prisma response
    const fakePost = {
      id: 1,
      title: "Test Post",
      userId: 123,
      isPublic: true,
    };

    prisma.post.create.mockResolvedValue(fakePost);

    const res = await request(app)
      .post("/post/create")
      .send({
        title: "Test Post",
        isPublic: true,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.title).toBe("Test Post");
    expect(res.body.post.userId).toBe(123);

    expect(prisma.post.create).toHaveBeenCalledWith({
      data: {
        title: "Test Post",
        userId: 123,
        isPublic: true,
      },
    });
  });

  it("rejects if user is not authenticated", async () => {
    const app = createApp(false); // unauthenticated app

    const res = await request(app)
      .post("/post/create")
      .send({ title: "Unauthorized Test" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authenticated");
  });
});




