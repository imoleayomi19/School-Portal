import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import './App.css';

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  
  return currentUser ? <Dashboard /> : <UnauthenticatedApp />;
}

function UnauthenticatedApp() {
  const [isLogin, setIsLogin] = useState(true);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return isLogin ? 
    <Login toggleForm={toggleForm} /> : 
    <SignupForm toggleForm={toggleForm} />;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </div>
  );
}

export default App;