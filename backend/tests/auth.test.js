process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const prisma = require("../prismaClient");

//console.log("ENV FILE:", process.env.NODE_ENV);
//console.log("DATABASE_URL:", process.env.DATABASE_URL);


describe("AUTH ROUTES", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /auth/sign-up", () => {
    test("creates a new user", async () => {
      const res = await request(app)
        .post("/auth/sign-up")
        .send({
          username: "alice",
          password: "password123",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.username).toBe("alice");
    });

    test("rejects duplicate username", async () => {
      await prisma.user.create({
        data: { username: "alice", password: "hashed" },
      });

      const res = await request(app)
        .post("/auth/sign-up")
        .send({
          username: "alice",
          password: "password123",
        });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /auth/sign-in", () => {
    beforeEach(async () => {
      await request(app)
        .post("/auth/sign-up")
        .send({
          username: "bob",
          password: "password123",
        });
    });

    test("logs in valid user and sets session cookie", async () => {
      const res = await request(app)
        .post("/auth/sign-in")
        .send({
          username: "bob",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("rejects invalid password", async () => {
      const res = await request(app)
        .post("/auth/sign-in")
        .send({
          username: "bob",
          password: "wrong",
        });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /auth/session", () => {
    test("returns not authenticated when logged out", async () => {
      const res = await request(app).get("/auth/session");

      expect(res.status).toBe(401);
    });

    test("returns user when logged in", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/sign-up")
        .send({ username: "carol", password: "password123" });

      await agent
        .post("/auth/sign-in")
        .send({ username: "carol", password: "password123" });

      const res = await agent.get("/auth/session");

      expect(res.status).toBe(200);
      expect(res.body.username).toBe("carol");
    });
  });

  describe("POST /logout", () => {
    test("logs out authenticated user", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/sign-up")
        .send({ username: "dan", password: "password123" });

      await agent
        .post("/auth/sign-in")
        .send({ username: "dan", password: "password123" });

      const res = await agent.post("/logout");

      expect(res.status).toBe(200);

      const sessionRes = await agent.get("/auth/session");
      expect(sessionRes.status).toBe(401);
    });
  });
});

