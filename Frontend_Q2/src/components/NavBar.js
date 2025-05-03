// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Social Media Analytics
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Feed
          </Button>
          {/* <Button color="inherit" component={Link} to="/users">
            Users
          </Button> */}
          <Button color="inherit" component={Link} to="/top-users">
            Top Users
          </Button>
          <Button color="inherit" component={Link} to="/trending-posts">
            Trending Posts
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
