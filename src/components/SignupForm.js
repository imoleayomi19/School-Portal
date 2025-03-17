import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function SignupForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    grade: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const userData = {
        name: formData.name,
        studentId: formData.studentId,
        grade: formData.grade,
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
            placeholder="John Imole"
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
            placeholder="@gmail.com"
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
            placeholder="123456"
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
            placeholder="100L"
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
            placeholder="********"
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
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      <p>
        Already have an account?
        <button onClick={toggleForm} className="btn-link">
          Login
        </button>
      </p>
    </div>
  );
}

export default SignupForm;
