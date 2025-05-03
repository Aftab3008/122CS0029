import React, { useEffect, useState } from "react";
import { getUsers, getPopular, getLatest } from "../api/api";
import {
  Card,
  Typography,
  CircularProgress,
  Container,
  Box,
  CardContent,
} from "@mui/material";
import { Grid } from "@mui/material";

export default function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      const usersRes = await getUsers();
      const users = usersRes.data.users || {};

      const allPosts = [];

      for (const [id, name] of Object.entries(users)) {
        const postsRes = await getPopular();
        const posts = postsRes.data.posts || [];

        for (const post of posts) {
          const commentsRes = await getLatest();
          const commentCount = commentsRes.data.comments?.length || 0;

          allPosts.push({
            ...post,
            commentCount,
            username: name || "Unknown User",
          });
        }
      }

      const maxCommentCount = Math.max(
        ...allPosts.map((p) => p.commentCount || 0)
      );

      const topPosts = allPosts.filter(
        (p) => p.commentCount === maxCommentCount
      );

      setTrendingPosts(topPosts);
    };

    fetchTrendingPosts();
  }, []);

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4} mb={4}>
        <Typography variant="h4" fontWeight={600}>
          🔥 Trending Posts
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {trendingPosts.length ? (
          trendingPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    @{post.username}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {post.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block", color: "gray" }}
                  >
                    💬 {post.commentCount} comments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
