First, let's create the JSON file to store our student data:

```json
{
  "users": [],
  "students": []
}
 ```

Now, let's create the authentication context:

```jsx
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
 ```
```

Let's create the Login component:

```jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ toggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login to School Portal</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Login</button>
      </form>
      
      <p>
        Don't have an account? 
        <button onClick={toggleForm} className="btn-link">Sign up</button>
      </p>
    </div>
  );
}

export default Login;
 ```
```

Now, let's create the SignupForm component:

```jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SignupForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    grade: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      const userData = {
        name: formData.name,
        studentId: formData.studentId,
        grade: formData.grade
      };
      
      await signup(formData.email, formData.password, userData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Student Registration</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Student ID</label>
          <input 
            type="text" 
            name="studentId" 
            value={formData.studentId} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Grade</label>
          <input 
            type="text" 
            name="grade" 
            value={formData.grade} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Register</button>
      </form>
      
      <p>
        Already have an account? 
        <button onClick={toggleForm} className="btn-link">Login</button>
      </p>
    </div>
  );
}

export default SignupForm;
 ```
```

Let's create the StudentList component:

```jsx
import React, { useState, useEffect } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Load students from localStorage
    const studentsData = JSON.parse(localStorage.getItem('studentsData')) || { students: [] };
    setStudents(studentsData.students);
  }, []);

  return (
    <div className="student-list">
      <h2>Registered Students</h2>
      
      {students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.studentId}</td>
                <td>{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;
 ```
```

Now, let's create the Dashboard component:

```jsx
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
 ```
```

Finally, let's update the App.js file:

```jsx
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
 ```
```

Let's add some styling with App.css:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Auth Forms */
.auth-form {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-form h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

/* Buttons */
.btn-primary {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-link {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 16px;
  margin-left: 5px;
}

.btn-logout {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Dashboard */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Student List */
.student-list {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.student-list h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

table tr:hover {
  background-color: #f9f9f9;
}
 ```
```

To run the application:

```bash
npm start
 ```

This implementation includes:

1. User authentication (signup, login, logout)
2. Student registration with form validation
3. Student list display
4. Data persistence using localStorage (JSON)
5. Responsive design with clean UI
The data is stored in the browser's localStorage, which makes it persist between sessions. When a student signs up, their information is stored in the JSON structure and displayed in the student list.