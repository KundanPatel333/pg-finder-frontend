import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import Visits from "./pages/Visits";
import Browse from "./pages/Browse";
import PGDetail from "./pages/PGDetail";
import MyVisits from "./pages/MyVisits";
import PGOwnerDetail from "./pages/PGOwnerDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Owner routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
  path="/pg-owner/:id"
  element={
    <ProtectedRoute allowedRoles={["owner"]}>
      <PGOwnerDetail />
    </ProtectedRoute>
  }
/>
          <Route
            path="/visits"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Visits />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/browse"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Browse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pg/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PGDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-visits"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyVisits />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;