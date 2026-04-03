import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ResultPage from './pages/ResultPage'
import React from 'react' 

function PrivateRoute({ children }: { children: React.ReactElement }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/result/:id" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}