import NodeCache from "node-cache";
import { api } from "../lib/api.js";
import { Post, User, Comment } from "../types/index.js";

const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

export async function fetchUsers(): Promise<User[]> {
  const key = "users";
  let data = cache.get<User[]>(key);
  if (!data) {
    try {
      const resp = await api.get<{ users: Record<string, string> }>("/users");
      data = Object.entries(resp.data.users).map(([id, name]) => ({
        id,
        name,
      }));
      cache.set(key, data);
    } catch (error: any) {
      console.error("Error fetching users:", error?.message);
      throw new Error("Failed to fetch users");
    }
  }
  return data || [];
}

export async function fetchPostsByUser(userId: string): Promise<Post[]> {
  const key = `posts_${userId}`;
  let data = cache.get<Post[]>(key);
  if (!data) {
    try {
      const resp = await api.get<{ posts?: Post[] }>(`/users/${userId}/posts`);
      data = resp.data?.posts || [];
      cache.set(key, data);
    } catch (error: any) {
      console.warn(
        `No posts found or error fetching for user ${userId}:`,
        error?.message
      );
      data = [];
      cache.set(key, data);
    }
  }
  return data || [];
}

export async function fetchCommentsByPost(postId: number): Promise<Comment[]> {
  const key = `comments_${postId}`;
  let data = cache.get<Comment[]>(key);
  if (!data) {
    try {
      const resp = await api.get<{ comments?: Comment[] }>(
        `/posts/${postId}/comments`
      );
      data = resp.data?.comments ?? [];
      cache.set(key, data);
    } catch (error: any) {
      console.warn(
        `No comments found or error fetching for post ${postId}:`,
        error?.message
      );
      data = [];
      cache.set(key, data);
    }
  }
  return data || [];
}

export async function fetchAllPosts(): Promise<Post[]> {
  const key = "all_posts";
  let data = cache.get<Post[]>(key);
  if (!data) {
    try {
      const users = await fetchUsers();
      const posts: Post[] = [];

      for (const user of users) {
        try {
          const resp = await api.get<{ posts?: Omit<Post, "createdAt">[] }>(
            `/users/${user.id}/posts`
          );
          const userPosts = resp.data?.posts ?? [];
          const enriched = userPosts.map((p) => ({
            ...p,
            createdAt: new Date().toISOString(),
          }));
          posts.push(...enriched);
        } catch (innerErr: any) {
          console.warn(
            `Skipping user ${user.id} due to post fetch error:`,
            innerErr?.message
          );
        }
      }

      data = posts;
      cache.set(key, data);
    } catch (error: any) {
      console.error("Error fetching all posts:", error?.message);
      throw new Error("Failed to fetch all posts");
    }
  }
  return data || [];
}
