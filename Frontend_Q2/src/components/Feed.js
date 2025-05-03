import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Container,
} from "@mui/material";
import { getUsers, getUserPosts, getPopular } from "../api/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const usersRes = await getUsers();
        const users = usersRes.data.users;

        const allPosts = [];

        // Fetch posts for each user
        for (const [id, username] of Object.entries(users)) {
          const postsRes = await getPopular();
          const userPosts = postsRes.data.posts || [];

          const enriched = userPosts.map((post) => ({
            ...post,
            username,
          }));

          allPosts.push(...enriched);
        }

        // Sort by latest (higher ID = newer)
        allPosts.sort((a, b) => b.id - a.id);

        // Take top 10 latest
        setPosts(allPosts.slice(0, 10));
      } catch (err) {
        console.error("Error loading live feed:", err);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mt={4} mb={4}>
        <Typography variant="h4" fontWeight={600}>
          Live Feed
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {posts.length ? (
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    @{post.username}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Grid>
    </Container>
  );
}
