import { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const url = isRegister 
        ? "http://localhost:3000/api/auth/register" 
        : "http://localhost:3000/api/auth/login";

      const bodyData = isRegister 
        ? { username, email, password, role }
        : { username, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isRegister ? "Registration failed" : "Login failed"));
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setError("");
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        <p className="login-subtitle">
          {isRegister ? "Register a new account to read online" : "Please log in to your account"}
        </p>

        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleAction}>
          <div className="login-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          {isRegister && (
            <div className="login-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {isRegister && (
            <div className="login-form-group">
              <label>Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User (Reader)</option>
                <option value="admin">Admin (Librarian)</option>
              </select>
            </div>
          )}

          <div className="login-buttons">
            <button type="button" className="btn-clear" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
            </button>
          </div>
        </form>

        <div className="login-toggle">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => { setIsRegister(false); handleClear(); }}>
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account yet?{" "}
              <span onClick={() => { setIsRegister(true); handleClear(); }}>
                Register here
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;