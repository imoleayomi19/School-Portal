import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentList from './StudentList';

function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>School Portal</h1>
        <div className="user-info">
          <span>Logged in as: {currentUser.email}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      
      <main>
        <StudentList />
      </main>
    </div>
  );
}

export default Dashboard;