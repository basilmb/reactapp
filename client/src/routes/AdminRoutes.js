// AdminRoutes.js
import React from "react";
import { MDBSpinner } from "mdb-react-ui-kit";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import EditUser from "../pages/admin/EditUser";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function AdminRoutes() {
  const { loading } = useSelector((state) => state.alerts);

  const token = localStorage.getItem("adminToken");

  return (
    <>
      {loading && (
        <div className="spinner-admin">
          <div className="spinner-border">
            <MDBSpinner role="status"></MDBSpinner>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
        <Route path="/edituser" element={token ? <EditUser /> : <Login />} />
      </Routes>
    </>
  );
}

export default AdminRoutes;
