import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaWallet } from "react-icons/fa";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
    console.error("EXACT ERROR:", error.response?.data || error.message);
    alert(error.response?.data?.message || error.response?.data || error.message);
      alert("Registration failed. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="logo-icon">
            <FaWallet />
          </div>
          <h2>Get Started</h2>
          <p>Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register →"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;