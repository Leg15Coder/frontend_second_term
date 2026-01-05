import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./app/store";
import { initAuth } from "./features/user/userSlice";
import SwaggerView from "./pages/Public/SwaggerView";
import FeaturesPage from "./pages/Public/FeaturesPage";
import RoadmapPage from "./pages/Public/RoadmapPage";
import InvestmentPage from "./pages/Public/InvestmentPage";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import EmailVerifiedPage from "./pages/Auth/EmailVerifiedPage";
import ApiDocs from "./pages/Public/ApiDocs";
import LandingPage from "./pages/Public/LandingPage";
import Index from "./pages/Index";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import HabitsPage from "./pages/Habits/HabitsPage";
import GoalsPage from "./pages/Goals/GoalsPage";
import TodosPage from "./pages/Todos/TodosPage";
import ChallengesPage from "./pages/Challenges/ChallengesPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import GroupsPage from "./pages/Groups/GroupsPage";
import GroupDetail from "./pages/Groups/GroupDetail";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authPromise = dispatch(initAuth());
    return () => {
      authPromise.abort?.();
    };
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />
            <Route path="/public/api" element={<ApiDocs />} />
            <Route path="/public/swagger" element={<SwaggerView />} />
            <Route path="/public/features" element={<FeaturesPage />} />
            <Route path="/public/roadmap" element={<RoadmapPage />} />
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contacts" element={<Contacts />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
            <Route path="/todos" element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

