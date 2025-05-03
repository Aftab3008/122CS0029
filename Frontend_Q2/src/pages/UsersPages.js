// src/pages/UsersPage.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  Button,
  Avatar,
  CardContent,
  Box,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getUsers } from "../api/api";

export default function UsersPage() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data.users || {});
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, "0");
    }
    return color;
  };

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mt={4} mb={4}>
        <Typography variant="h4" fontWeight={600}>
          All Users
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {Object.entries(users).map(([id, name]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
            <Card
              sx={{
                textAlign: "center",
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  bgcolor: stringToColor(name),
                  fontSize: 20,
                }}
              >
                {name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </Avatar>

              <CardContent>
                <Typography variant="h6" fontWeight={500}>
                  {name}
                </Typography>
                <Button
                  component={Link}
                  to={`/users/${id}`}
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  View Posts
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
