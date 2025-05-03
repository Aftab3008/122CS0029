// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/Feed";
import TopUsers from "./components/TopUsers";
import TrendingPosts from "./components/TrendingPosts";
import UsersPage from "./pages/UsersPages";
import UserPostsPage from "./pages/UsersPostsPage";
import Navbar from "./components/NavBar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/top-users" element={<TopUsers />} />
        <Route path="/trending-posts" element={<TrendingPosts />} />
        {/* <Route path="/users" element={<UsersPage />} /> */}
        <Route path="/users/:id" element={<UserPostsPage />} />
      </Routes>
    </Router>
  );
}
