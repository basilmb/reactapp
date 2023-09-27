// UserRoutes.js
import React from "react";
import { MDBSpinner } from "mdb-react-ui-kit";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Login from "../pages/user/Login";
import Signup from "../pages/user/Signup";
import Profile from "../pages/user/Profile";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function UserRoutes() {
  const { loading } = useSelector((state) => state.alerts);

  const token = localStorage.getItem("token");

  return (
    <>
      {loading && (
        <div className="spinner-user">
          <div className="spinner-border">
            <MDBSpinner role="status"></MDBSpinner>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route path="/signup" element={token ? <Home /> : <Signup />} />
        <Route path="/home" element={token ? <Home /> : <Login />} />
        <Route path="/profile" element={token ? <Profile /> : <Login />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
