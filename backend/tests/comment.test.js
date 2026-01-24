// tests/postCreate.test.js
const request = require("supertest");
const express = require("express");

// Mock prisma
jest.mock("../prismaClient", () => ({
  comment: {
    create: jest.fn(),
  },
}));

const prisma = require("../prismaClient");
const commentRouter = require("../routes/commentRouter");

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

  app.use("/", commentRouter);
  return app;
}

// -------------------------------
// TESTS
// -------------------------------

describe("POST /comment/create", () => {
  it("creates a new comment successfully when authenticated", async () => {
    const app = createApp(true); // authenticated app

    // Mock prisma response
    const fakeComment = {
      id: 1,
      userId: 123,
      postId: 1234,
      content: 'This is test comment',
      isPublic: true,
    };

    prisma.comment.create.mockResolvedValue(fakeComment);

    const res = await request(app)
      .post("/comment/create/1234")
      .send({
        content: 'This is test comment',
        postId: 1234,
        isPublic: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Comment created");
    expect(res.body.comment.content).toBe("This is test comment");
    expect(res.body.comment.id).toBe(1);

    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
         userId: 123,
         postId: 1234,
         content: 'This is test comment',
      },
    });
  });

})
  /*
  it("rejects comment if user is not authenticated", async () => {
    const app = createApp(false); // unauthenticated app

    const res = await request(app)
      .post("/comment/create")
      .send({ title: "Unauthorized Test" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authenticated");
  });
});

it("delete comment", async () => {
    const app = createApp(false); // unauthenticated app

    const res = await request(app)
      .post("/comment/create")
      .send({ title: "Unauthorized Test" });

    expect(res.status).toBe(201)
}


);
*/