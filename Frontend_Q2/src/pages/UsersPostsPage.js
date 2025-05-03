// src/pages/UserPostsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Container,
} from "@mui/material";
import { getUsers, getUserPosts, getPopular } from "../api/api";

export default function UserPostsPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          getUsers(),
          getPopular(),
        ]);

        const users = userRes.data.users || {};
        const userPosts = postsRes.data.posts || [];

        setUsername(users[id] || "Unknown User");
        setPosts(userPosts);
      } catch (err) {
        console.error("Error loading user posts:", err);
      }
    };

    fetchUserPosts();
  }, [id]);

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mt={4} mb={4}>
        <Typography variant="h4" fontWeight={600}>
          Posts by {username}
        </Typography>
      </Box>

      {posts.length ? (
        <Grid container spacing={4} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  maxWidth: 345,
                  mx: "auto",
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
