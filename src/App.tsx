import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './authcontext'; // Ensure the correct path
import Login from './components/Login';
import Register from './components/Register';
import ExpenseTracker from './components/expensetracker'; // Ensure correct path

const App: React.FC = () => {
  const { token } = useAuth(); // Use custom hook

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/expenses" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to="/expenses" replace /> : <Register />} 
        />
        <Route 
          path="/expenses" 
          element={token ? <ExpenseTracker /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={token ? "/expenses" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
