import { Request, Response } from "express";
import {
  fetchCommentsByPost,
  fetchPostsByUser,
  fetchUsers,
} from "../services/data.services.js";

export const getTopUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchUsers();
    const userComments: { [key: string]: number } = {};

    for (const user of users) {
      const posts = await fetchPostsByUser(user.id);
      let totalComments = 0;
      for (const post of posts) {
        const comments = await fetchCommentsByPost(post.id);
        totalComments += comments.length;
      }
      userComments[user.id] = totalComments;
    }

    const result = users
      .map((u) => ({ ...u, totalComments: userComments[u.id] || 0 }))
      .sort((a, b) => b.totalComments - a.totalComments)
      .slice(0, 5);

    res.status(200).json({
      message: "Top 5 users with the most comments",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching top users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
