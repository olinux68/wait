import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreateQueue from './components/Queue/CreateQueue';
import JoinQueue from './components/Queue/JoinQueue';
import Position from './components/Position';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-queue" element={<CreateQueue />} />
      <Route path="/join-queue" element={<JoinQueue />} />
      <Route path="/position" element={<Position />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/:queueId/join" element={<JoinQueue />} /> {/* Route dynamique */}
    </Routes>
  </Router>
);

export default AppRoutes;
