import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const testMongoUri = process.env.TEST_MONGO_URI || "mongodb://127.0.0.1:27017/tasktracker_test";

let authToken;
let testUserId;

beforeAll(async () => {
  await mongoose.connect(testMongoUri);
});

afterAll(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  const regRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      workspaceName: "Test Workspace"
    });

  authToken = regRes.body.data.token;
  testUserId = regRes.body.data.user.id;
});

describe("Task API Endpoints", () => {
  describe("POST /api/tasks", () => {
    it("should create a new task when validation passes", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Task",
          description: "Test description",
          priority: "High",
          status: "Todo",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Test Task");
      expect(res.body.data.description).toBe("Test description");
    });

    it("should fail validation if title is missing", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          description: "Test description",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation error");
    });
  });

  describe("GET /api/tasks", () => {
    it("should retrieve all tasks", async () => {
      await Task.create([
        { title: "Task 1", description: "Desc 1", status: "Todo", user: testUserId },
        { title: "Task 2", description: "Desc 2", status: "In Progress", user: testUserId },
      ]);

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it("should filter tasks by status", async () => {
      await Task.create([
        { title: "Task 1", description: "Desc 1", status: "Todo", user: testUserId },
        { title: "Task 2", description: "Desc 2", status: "Completed", user: testUserId },
      ]);

      const res = await request(app)
        .get("/api/tasks?status=Completed")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Task 2");
    });
  });

  describe("GET /api/tasks/stats", () => {
    it("should retrieve accurate stats of tasks", async () => {
      await Task.create([
        { title: "Task 1", status: "Todo", user: testUserId },
        { title: "Task 2", status: "In Progress", user: testUserId },
        { title: "Task 3", status: "Completed", user: testUserId },
      ]);

      const res = await request(app)
        .get("/api/tasks/stats")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(3);
      expect(res.body.data.completed).toBe(1);
      expect(res.body.data.pending).toBe(1);
      expect(res.body.data.inProgress).toBe(1);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task details successfully", async () => {
      const task = await Task.create({ title: "Task", status: "Todo", user: testUserId });
      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Updated Task Name",
          status: "In Progress",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Updated Task Name");
      expect(res.body.data.status).toBe("In Progress");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete task successfully", async () => {
      const task = await Task.create({ title: "Task To Delete", user: testUserId });
      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });
});
