import { Request, Response } from "express";
import { Post } from "../types/index.js";
import {
  fetchAllPosts,
  fetchCommentsByPost,
} from "../services/data.services.js";

export const getPostsByType = async (req: Request, res: Response) => {
  const type = req.query.type;
  if (!type) {
    res.status(400).json({ error: "Type parameter is required" });
    return;
  }
  if (type !== "popular" && type !== "latest") {
    res.status(400).json({ error: "Invalid type parameter" });
    return;
  }
  try {
    const posts: Post[] = await fetchAllPosts();
    if (type === "latest") {
      const latest = posts.sort((a, b) => b.id - a.id).slice(0, 5);
      res.status(200).json({
        message: "Latest posts fetched successfully",
        posts: latest,
      });
      return;
    }

    let maxCount = 0;
    const countMap: Record<number, number> = {};
    for (const post of posts) {
      const comments = await fetchCommentsByPost(post.id);
      countMap[post.id] = comments.length;
      if (comments.length > maxCount) maxCount = comments.length;
    }
    const popular = posts.filter((p) => countMap[p.id] === maxCount);
    res.status(200).json({
      message: "Popular posts fetched successfully",
      posts: popular,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};
