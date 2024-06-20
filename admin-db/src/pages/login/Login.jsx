import { useContext, useMemo, useState } from "react"
import "./login.scss"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"


const Login = () => {
    const [ credentials, setCredentials ] = useState({
        phone: undefined,
        password: undefined,
    })

const {loading,error,dispatch} = useContext(AuthContext)

const navigate = useNavigate()

const axiosInstance = useMemo(() => {
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
}, []);

const handleChange = (e) => {
    setCredentials(prev =>({...prev, [e.target.id]: e.target.value }));
};

const handleClick = async e =>{
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try{
        const res = await axiosInstance.post("/auth/login", credentials);
        if (res.data.isAdmin){
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
        }else{
            dispatch({type:"LOGIN_FAILURE", payload: {message: "You are not allowed!"} });    
        }
    }catch(err){
        dispatch({type:"LOGIN_FAILURE", payload: err.response.data });
    }
};


  return (
    <div className="login">
        <div className="lcontainer">
            <input type="text" placeholder="phone" id="phone" onChange={handleChange} className="lInput" />
            <input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput" />
            <button disabled={loading}onClick={handleClick} className="lButton">
                LOGIN
            </button>
            {error && <span>{error.message}</span>}
        </div>
    </div>
)
}

export default Login