import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login.jsx";
import UserProfile from "./pages/UserProfile";
import ViewUsers from "./pages/admin/ManageUsers";
import ManageData from "./pages/admin/ManageData";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import RequestOtpForm from "./pages/ResetPasswordOTP";
import UserRoutes from "./protectedRoutes/UserRoutes";
import AdminRoutes from "./protectedRoutes/AdminRoutes";
import AddData from "./pages/AddData.jsx";
import ViewData from "./pages/ViewData.jsx";
import EditData from "./pages/EditData.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import AuditTrail from "./pages/admin/AuditTrail.jsx";


function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} />
      <ToastContainer />
      <Routes>

  
        <Route path="/" element={< Homepage/>} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element = {<ResetPasswordForm/>}/>
        <Route path="/forgot-password" element = {<RequestOtpForm/>}/>
        <Route path="/create_data" element = {<AddData/>}/>
        <Route path="/view-data" element = {<ViewData/>}/>
        <Route path='/edit/:id' element={<EditData />} />
        <Route path="/user/:id/verify/:token" element={<VerifyEmail />} />


        <Route path="/profile" element={<UserProfile />} />

        <Route element={<UserRoutes />}>
          <Route path="/profile" element={<h1>Profile</h1>} />
        </Route>

        {isAdmin && (
          <Route element={<AdminRoutes />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ViewUsers/>} />
            <Route path="/admin/manage-data" element={<ManageData/>} />
            <Route path="/admin/audit-trails" element={<AuditTrail />} />
          </Route>
        )}

      </Routes>
    </Router>
  );
}

export default App;