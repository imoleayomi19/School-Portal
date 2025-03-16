import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = (email, password, userData) => {
    // Get existing users
    let studentsData = JSON.parse(localStorage.getItem('studentsData')) || { users: [], students: [] };
    
    // Check if user already exists
    const userExists = studentsData.users.some(user => user.email === email);
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = { email, password };
    studentsData.users.push(newUser);
    
    // Add student data
    studentsData.students.push({
      ...userData,
      email,
      id: Date.now().toString()
    });
    
    // Save to localStorage
    localStorage.setItem('studentsData', JSON.stringify(studentsData));
    
    // Set current user
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  };

  const login = (email, password) => {
    const studentsData = JSON.parse(localStorage.getItem('studentsData')) || { users: [], students: [] };
    const user = studentsData.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}