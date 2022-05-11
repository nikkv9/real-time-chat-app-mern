import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppState } from "../context/ContextProvider";

function Login() {
  const { user, setUser } = AppState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (userInfo) navigate("/");
  }, []);

  const loginHandle = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please fill all the inputs");
    }
    try {
      const data = await axios.post(
        "/user/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert("invalid credentials!");
    }
  };
  return (
    <div className="signup">
      <div className="signupContainer">
        <h2>Chat &nbsp;App</h2>
        <form className="inputContainer">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="loginBtn" onClick={loginHandle}>
            LOGIN
          </button>
          <Link to="/signup">
            <p>dont have an account</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
