// tests/user.test.js
const request = require("supertest");
const express = require("express");

// Mock prisma
jest.mock("../prismaClient", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const prisma = require("../prismaClient");
const userRouter = require("../routes/userRouter");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/", userRouter);
  return app;
}

describe("POST /sign-up", () => {
  it("signs up new user", async () => {
    process.env.NODE_ENV = "test";
    const app = createApp();

    prisma.user.findUnique.mockResolvedValue(null);

    const mockUser = {
      id: 1,
      username: "John",
      password: "hashedpassword",
      admin: false,
    };

    prisma.user.create.mockResolvedValue(mockUser);

    const res = await request(app).post("/sign-up").send({
      username: "John",
      password: "password",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("John");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "John" },
    });

    expect(prisma.user.create).toHaveBeenCalled();
  });

  it("rejects duplicate username", async () => {
    process.env.NODE_ENV = "test";
    const app = createApp();

    prisma.user.findUnique.mockResolvedValue({ id: 5, username: "John" });

    const res = await request(app).post("/sign-up").send({
      username: "John",
      password: "abc",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Username already exists.");
  });
});
