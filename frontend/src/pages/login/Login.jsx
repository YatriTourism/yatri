import { useContext, useState } from "react";
import "./login.css";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import backgroundVideo from "./background.mp4";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    phone: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const dates = location.state && location.state.dates;
  const options = location.state && location.state.options;

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

      const redirectedFromPackage =
        location.state &&
        location.state.redirectedFrom &&
        location.state.redirectedFrom.startsWith("/packages");

        if (redirectedFromPackage) {
          navigate(location.state.redirectedFrom, { state: { dates, options } });
        } else {
          navigate("/", { state: { dates, options } });
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          toast.error("Incorrect Phone number or Password.");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
  };

  return (
    <div className="login">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={backgroundVideo} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
      <div className="lContainer">
        <ToastContainer />
        <h2>Login Form</h2>
        <input
          type="tel"
          placeholder="Phone"
          id="phone"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          LOGIN
        </button>
        {error && <span style={{ color: error.color }}>{error.message}</span>}
        <div className="logbox">
          <div className="top">
            <p className="linkToforgotPass"><Link style={{ color: "inherit" }} to={"/forgot-password"}>Forgot Password?</Link></p>
          </div>
          <div className="down">
            <p className="linkToRegister">Do not have an account yet?</p>
            <Link style={{ color: "inherit", textDecoration: "none" }} to={"/register"}><button className="register">Register</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
