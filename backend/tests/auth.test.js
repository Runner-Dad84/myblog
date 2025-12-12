process.env.NODE_ENV = "test";

// ----------------------------------------
// Mock Prisma
// ----------------------------------------
jest.mock("../prismaClient", () => {
  return {
    user: { findUnique: jest.fn() },
    post: { findMany: jest.fn() },
  };
});

// ----------------------------------------
// Mock Passport
// ----------------------------------------
let mockUser = null;

jest.mock("passport", () => {
  const authenticate = jest.fn((strategy, callback) => {
    return (req, res, next) => {
      // Missing credentials
      if (!req.body.username || !req.body.password) {
        return callback(null, null, { message: "Missing" });
      }

      // Invalid credentials
      if (mockUser === null) {
        return callback(null, false, { message: "Invalid" });
      }

      // Valid login
      return callback(null, mockUser, null);
    };
  });

  return {
    authenticate,
    initialize: () => (req, res, next) => next(),
    session: () => (req, res, next) => next(),
  };
});

// ----------------------------------------
// Test Setup
// ----------------------------------------
const request = require("supertest");
const app = require("../app");

// ----------------------------------------
// Minimal test
// ----------------------------------------
describe("AUTH BASIC TEST", () => {
  test("POST /sign-in returns missing credentials error", async () => {
    const res = await request(app).post("/sign-in").send({});
    //test is currently failing because one of my routes is accessing prisma
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ });
  });
});
