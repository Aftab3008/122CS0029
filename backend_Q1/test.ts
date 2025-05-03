/*
Social Media Analytics Microservice
Technologies: Node.js, Express, TypeScript
Functionality:
 - GET /users -> Top 5 users by total comments on their posts
 - GET /posts?type=popular|latest -> popular: posts with max comments; latest: 5 newest posts
Design:
 - DataService handles interaction with test server API
 - Caching with in-memory stores and TTL to reduce API calls
 - Efficient retrieval using sorted lists and maps
*/

import express, { Request, Response } from "express";
import axios from "axios";
import NodeCache from "node-cache";

type User = { id: string; name: string };
type Post = { id: string; userId: string; content: string; createdAt: string };
type Comment = { id: string; postId: string; text: string };

const TEST_SERVER = "http://test-server/api";
const PORT = process.env.PORT || 3000;

const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 }); // 30s TTL

class DataService {
  static async fetchUsers(): Promise<User[]> {
    const key = "users";
    let data = cache.get<User[]>(key);
    if (!data) {
      const resp = await axios.get<User[]>(`${TEST_SERVER}/users`);
      data = resp.data;
      cache.set(key, data);
    }
    return data;
  }

  static async fetchPosts(): Promise<Post[]> {
    const key = "posts";
    let data = cache.get<Post[]>(key);
    if (!data) {
      const resp = await axios.get<Post[]>(`${TEST_SERVER}/posts`);
      data = resp.data;
      cache.set(key, data);
    }
    return data;
  }

  static async fetchComments(): Promise<Comment[]> {
    const key = "comments";
    let data = cache.get<Comment[]>(key);
    if (!data) {
      const resp = await axios.get<Comment[]>(`${TEST_SERVER}/comments`);
      data = resp.data;
      cache.set(key, data);
    }
    return data;
  }
}

const app = express();

// GET /users -> Top 5 users by comment count on their posts
app.get("/users", async (_req: Request, res: Response) => {
  try {
    const [users, posts, comments] = await Promise.all([
      DataService.fetchUsers(),
      DataService.fetchPosts(),
      DataService.fetchComments(),
    ]);

    // Map postId to count
    const commentCount = new Map<string, number>();
    comments.forEach((c) =>
      commentCount.set(c.postId, (commentCount.get(c.postId) || 0) + 1)
    );

    // Map userId to total comments
    const userComments = new Map<string, number>();
    posts.forEach((p) => {
      const cnt = commentCount.get(p.id) || 0;
      userComments.set(p.userId, (userComments.get(p.userId) || 0) + cnt);
    });

    // Sort users by comments desc
    const top = users
      .map((u) => ({ ...u, totalComments: userComments.get(u.id) || 0 }))
      .sort((a, b) => b.totalComments - a.totalComments)
      .slice(0, 5);

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /posts?type=popular|latest
app.get("/posts", async (req: Request, res: Response) => {
  const type = req.query.type;
  if (type !== "popular" && type !== "latest") {
    return res.status(400).json({ error: "Invalid type parameter" });
  }
  try {
    const [posts, comments] = await Promise.all([
      DataService.fetchPosts(),
      DataService.fetchComments(),
    ]);

    if (type === "latest") {
      // Sort by createdAt desc and take 5
      const latest = posts
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      return res.json(latest);
    }

    // popular
    const commentCount = new Map<string, number>();
    comments.forEach((c) =>
      commentCount.set(c.postId, (commentCount.get(c.postId) || 0) + 1)
    );

    // Determine max
    let max = 0;
    commentCount.forEach((c) => (c > max ? (max = c) : null));

    // Filter posts with count == max
    const popular = posts.filter((p) => (commentCount.get(p.id) || 0) === max);
    return res.json(popular);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
