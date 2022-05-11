import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);

  const passShow = () => {
    setShow(!show);
  };

  const signupHandle = async (e) => {
    e.preventDefault();
    if (pic) {
      const data = new FormData();
      const fileName = pic.name;
      data.append("file", pic);
      data.append("imgName", fileName);
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);

      if (!name || !email || !password) {
        return alert("Please fill all the inputs");
      }
      try {
        const res = await axios.post("/user/signup", data);
        console.log(res);
        navigate("/");
      } catch (error) {
        alert("something wrong here!");
      }
    }
  };
  return (
    <div className="signup">
      <div className="signupContainer">
        <h2>Chat &nbsp;App</h2>
        <form
          className="inputContainer"
          method="post"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="pass">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="passShow" onClick={passShow}>
              {show ? "hide" : "show"}{" "}
            </button>
          </div>
          <input
            type="file"
            placeholder="Profile pic"
            required
            onChange={(e) => setPic(e.target.files[0])}
          />
          <button type="submit" onClick={signupHandle}>
            SIGNUP
          </button>
          <Link to="/login">
            <p>already have an account</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
