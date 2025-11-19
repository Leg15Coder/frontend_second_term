import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import HabitsPage from './pages/Habits/HabitsPage'
import GoalsPage from './pages/Goals/GoalsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import * as Public from './pages/Public'
import './App.css'
import React from "react";

function App() {
  return (
    <div className="appRoot">
      <nav className="topNav">
        <Link to="/">Dashboard</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/mock?file=Dashboard.html">Mock: Dashboard</Link>
        <Link to="/mock?file=Habbits.html">Mock: Habits</Link>
        <Link to="/mock?file=auth.html">Mock: Auth</Link>
        <Link to="/mock?file=Pathway.html">Mock: Pathway</Link>
        <Link to="/mock?file=Finish_challenge.html">Mock: Finish</Link>
        <Link to="/mock?file=Finish_challenge_animated.html">Mock: Animated</Link>
        <Link to="/public/dashboard">Public Dashboard (React)</Link>
        <Link to="/public/habits">Public Habits</Link>
        <Link to="/public/goals">Public Goals</Link>
        <Link to="/public/pathway">Public Pathway</Link>
        <Link to="/public/challenges">Public Challenges</Link>
        <Link to="/public/profile">Public Profile</Link>
        <Link to="/public/profile/edit">Edit Profile</Link>
        <Link to="/public/settings">Settings</Link>
        <Link to="/public/onboarding">Onboarding</Link>
        <Link to="/public/admin">Admin</Link>
        <Link to="/public/finish">Finish</Link>
        <Link to="/public/finish-animated">Finish Animated</Link>
        <Link to="/public/modals">Modals</Link>
      </nav>
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mock" element={React.createElement(Public.MockView)} />
          <Route path="/public/dashboard" element={<Public.Dashboard />} />
          <Route path="/public/habits" element={<Public.Habits />} />
          <Route path="/public/habits/new" element={<Public.HabitCreateEdit />} />
          <Route path="/public/habits/:id" element={<Public.HabitDetail />} />
          <Route path="/public/goals" element={<Public.GoalsList />} />
          <Route path="/public/goals/new" element={<Public.GoalCreateEdit />} />
          <Route path="/public/goals/:id" element={<Public.GoalDetail />} />
          <Route path="/public/pathway" element={<Public.Pathway />} />
          <Route path="/public/challenges" element={<Public.ChallengesList />} />
          <Route path="/public/profile" element={<Public.ProfileView />} />
          <Route path="/public/profile/edit" element={<Public.ProfileEdit />} />
          <Route path="/public/settings" element={<Public.Settings />} />
          <Route path="/public/onboarding" element={<Public.Onboarding />} />
          <Route path="/public/admin" element={<Public.AdminPanel />} />
          <Route path="/public/finish" element={<Public.FinishChallenge />} />
          <Route path="/public/finish-animated" element={<Public.FinishChallengeAnimated />} />
          <Route path="/public/modals" element={<Public.ModalsDemo />} />
          <Route path="/public/error" element={<Public.ErrorPages />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
