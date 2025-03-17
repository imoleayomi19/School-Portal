import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = (email, password, userData) => {
    let studentsData = JSON.parse(localStorage.getItem("studentsData")) || {
      users: [],
      students: [],
    };

    const userExists = studentsData.users.some((user) => user.email === email);
    if (userExists) {
      throw new Error("User with this email already exists");
    }

    const newUser = { email, password };
    studentsData.users.push(newUser);

    studentsData.students.push({
      ...userData,
      email,
      id: Date.now().toString(),
    });

    localStorage.setItem("studentsData", JSON.stringify(studentsData));

    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return newUser;
  };

  const login = (email, password) => {
    const studentsData = JSON.parse(localStorage.getItem("studentsData")) || {
      users: [],
      students: [],
    };
    const user = studentsData.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
