import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Common/Login";
import Register from "./components/Common/Register";
import Home from "./components/Pages/Home";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Event from "./components/Pages/addEvents";
import AdminManagement from "./components/Admin/AdminManagement";
import AdminDashboard from "./components/Admin/AdminDashboard";

function AdminRoute({children}){
  if(localStorage.getItem("user_id") == 1){
    return children
  }
  else{
    return "You are not authoized to access this page."
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>} />
        <Route path="/admin/manage" element={
          <AdminRoute>
            <AdminManagement />
          </AdminRoute>} />
        <Route path="/admin/" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
