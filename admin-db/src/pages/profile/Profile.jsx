import { useContext, useEffect, useMemo, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./profile.scss"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { userColumns } from "../../dataTableSource"
import DataTable from "../../components/dataTable/DataTable"

const Profile = () => {

  const [editMode, setEditMode] = useState(false)
  const {user, dispatch} = useContext(AuthContext);
  const [updatedUser, setUpdateUser] = useState({...user});
  const [adminDetails, setAdminDetails] = useState([]);

  const axiosInstance = useMemo(() => {
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
}, []);
  
  const handleEditClick = async () => {
    setEditMode(!editMode)
  };

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setUpdateUser((prevUser) => ({...prevUser, [name]: value}))
  };

  const handleSaveChanges = async () => {
    try {
      dispatch({type: "LOGIN_START"}); //Start Loading State
      const response = await axiosInstance.put(`/users/profile/${user._id}, updatedUser`);
      dispatch({type: "LOGIN_SUCCESS", payload: response.data})
      setEditMode(false);
    } catch (error) {
      dispatch({type: "LOGIN_FAILURE", payload: error.response.data})
    }
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axiosInstance.get("/users/doc/admindetails");
        setAdminDetails(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, [axiosInstance]);

  const adminUsers = adminDetails.filter(user => user.isAdmin);

  
  if(!user) return <div>Loading...</div>;

  console.log(adminDetails)

  return (
    <div className="profile">
      <Sidebar />
      <div className="profileContainer">
        <Navbar />
        <div className="profileContent">
          <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleEditClick}>{editMode ? "Cancel" : "Edit"}</div>
            <h1 className="title">Profile</h1>
            <div className="item">
              <div className="details">
                <div className="detailItem">
                  <span className="itemKey">Full Name: </span>
                  <span className="itemValue">{editMode ? (<input type="text" name="fullName" value={updatedUser.username} onChange={handleChange}/>) : user.username}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{editMode ? (<input type="text" name="email" value={updatedUser.email} onChange={handleChange}/>) : user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone: </span>
                  <span className="itemValue">{editMode ? (<input type="text" name="phone" value={updatedUser.phone} onChange={handleChange}/>) : user.phone}</span>
                </div>
              </div>
            </div>
            {editMode && (<button className="save" onClick={handleSaveChanges}>Save changes</button>)}
             
          </div>
          </div>
          <div className="bottom">
            {user.phone === "9175334792" ? (
              <DataTable columns={userColumns} rows={adminUsers} />
            ) : (
              <div>You do not have access to view this data.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile