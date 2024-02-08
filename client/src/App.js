import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./routes/LoginForm";
import RegisterForm from "./routes/RegisterForm";
import React from "react";
import HomePage from "./routes/HomePage";
import UsersPage from "./routes/UsersPage";
import FriendsPage from "./routes/FriendsPage";
import ProfilePage from "./routes/ProfilePage";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
    );
}

export default App;
