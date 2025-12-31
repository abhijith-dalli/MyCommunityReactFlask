import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Event from "./components/Features/addEvents";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
