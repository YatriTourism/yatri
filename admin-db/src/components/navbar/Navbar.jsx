import "./navbar.scss";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState(0);
  const [checked, setChecked] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const {dispatch, darkMode} = useContext(DarkModeContext);
  const [modeIcon, setModeIcon] = useState(darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const axiosInstance = useMemo(() => {
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
}, []);
  useEffect(() => {
    const fetchCounts = async () => {
      try{
        const {data : pendingResponse} = await axiosInstance.get("/enquiry/count/Pending");
        const {data : checkedResponse} = await axiosInstance.get("/enquiry/count/Checked");
        const { data: assignedResponse } = await axiosInstance.get(`/enquiry/get/${user.username}`);
        setPending(pendingResponse.count);
        setChecked(checkedResponse.count);
        setAssigned(assignedResponse.count);
      } catch(error) {
        console.error("Error fetching pending count: ", error);
      }
    };
    fetchCounts();
  },[user.username,axiosInstance]);

  const handleMode = () =>{
    setModeIcon(darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />)
    dispatch({type: "TOGGLE"});
  };

  const toggleFullscreen = () => {
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
        if(document.exitFullscreen){
          document.exitFullscreen();
          setIsFullScreen(false);
      }
    }
  };
  
  return (
    <div className = "navbar">
        <div className="wrapper">
          <div className="items">
            <div className="item">
              <div className="icon" onClick={handleMode}>
                {modeIcon}
              </div>
            </div>
            <div className="item" onClick={toggleFullscreen}>
              {isFullScreen ? <FullscreenExitOutlinedIcon className="icon"/> : <FullscreenOutlinedIcon className="icon"/> }              
            </div>
            <div className="item">
              <NotificationsNoneOutlinedIcon className="icon" onClick={() => {navigate("/notifications")}}/>
              <div className="counter">{pending}</div>              
            </div>
            <div className="item">
              <PhoneOutlinedIcon className="icon" onClick={() => {navigate("/checked")}}/>
              <div className="counter">{checked}</div>              
            </div>
            <div className="item">
            <AssignmentOutlinedIcon className="icon" onClick={() => { navigate(`/assignedTo`) }} />
            <div className="counter">{assigned}</div>
          </div>
           
          </div>
        </div>
    </div>
  )
}

export default Navbar;