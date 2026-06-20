import { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate(); // ✅ correct place

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data.token)
      // localStorage.setItem("token", data.token);
      const Token = `token=${data.token}; path=/`;
      document.cookie = Token ;
      console.log(Token)

      navigate("/dashboard"); // ✅ works now
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <input
        type="text"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username or Email"
      />

      <br /><br />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={() => {
          setUserName("");
          setPassword("");
        }}
      >
        Clear
      </button>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;