import { getUsers, getPopular, getLatest } from "../api/api";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  Avatar,
  CardContent,
  Box,
  CircularProgress,
  Container,
  Chip,
} from "@mui/material";

export default function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await getUsers();
      const userList = userRes.data.users;

      const userCommentMap = {};

      for (const [id, name] of Object.entries(userList)) {
        userCommentMap[id] = { id, name, totalComments: 0 };
      }

      for (const [id] of Object.entries(userList)) {
        const postsRes = await getPopular();
        const posts = postsRes.data.posts || [];

        for (const post of posts) {
          const commentsRes = await getLatest();
          const commentCount = commentsRes.data.comments?.length || 0;

          if (userCommentMap[post.userid]) {
            userCommentMap[post.userid].totalComments += commentCount;
          }
        }
      }

      const commentCounts = Object.values(userCommentMap);
      commentCounts.sort((a, b) => b.totalComments - a.totalComments);
      setTopUsers(commentCounts.slice(0, 5));
    };

    fetchData();
  }, []);

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "gold";
      case 1:
        return "silver";
      case 2:
        return "#cd7f32";
      default:
        return "#1976d2";
    }
  };
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4} mb={4}>
        <Typography variant="h4" fontWeight={600}>
          Top Users by Comments
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {topUsers.length ? (
          topUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  textAlign: "center",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 1,
                    bgcolor: getRankColor(index),
                    fontSize: 22,
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </Avatar>
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Comments: {user.totalComments}
                  </Typography>
                  <Chip
                    label={`#${index + 1}`}
                    sx={{
                      bgcolor: getRankColor(index),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
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
