import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import ProjectDetail from "../pages/ProjectDetail";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Architecture from "@/pages/Architecture";
import Interior from "@/pages/Interior";
import Objects from "@/pages/Objects";
import Exhibition from "@/pages/Exhibition";
import Footer from "@/components/layout/Footer";

import DashboardLayout from "@/pages/DashboardLayout";
import PeopleDashboard from "@/pages/PeopleDashboard";
import PressDashboard from "@/pages/PressDashboard";
import PressPage from "@/pages/PressPage";
import StudioDashboard from "@/pages/StudioDashboard";

const AppRoutes = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-y-auto scroll-smooth">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/architecture/:subcategory?" element={<Architecture />} />
            <Route path="/interior/:subcategory?" element={<Interior />} />
            <Route path="/objects/:subcategory?" element={<Objects />} />
            <Route path="/exhibition/:subcategory?" element={<Exhibition />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/press" element={<PressPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/projects" replace />} />
              <Route path="projects" element={<AdminDashboard />} />
              <Route path="people" element={<PeopleDashboard />} />
              <Route path="press" element={<PressDashboard />} />
              <Route path="studio" element={<StudioDashboard />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
