import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Common/Login";
import Register from "./components/Common/Register";
import Home from "./components/Pages/Home";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Event from "./components/Pages/addEvents";
import AdminManagement from "./components/Admin/AdminManagement";

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
              <AdminManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
