import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import CreateInterviewPage from "../pages/CreateInterviewPage";
import InterviewPage from "../pages/InterviewPage";
import ReportPage from "../pages/ReportPage";
import SettingsPage from "../pages/SettingsPage";
import AdminPage from "../pages/AdminPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout - Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-interview" element={<CreateInterviewPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;