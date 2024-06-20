import { useEffect, useMemo, useState } from "react"
import "./assignedTable.scss"
import axios from "axios";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";

const AssignedTable = () => {
    const [assignedEnquiries, setAssignedEnquiries] = useState([]);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: process.env.REACT_APP_API_URL,
        });
    }, []);

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.username) {
        setLoggedInUsername(userData.username);
      }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/enquiry/get/${user.username}`);
                const fetchedEnquiries = response.data.enquiries || []; 
                setAssignedEnquiries(fetchedEnquiries);
            } catch (error) {
                console.error("Error fetching assigned enquiries: ", error)
            }
        };

        fetchData();
    }, [user.username,axiosInstance]);

    return(
        <div>
            <div className="loggedInUser">
                {loggedInUsername && <p>Logged in as: {loggedInUsername}</p>}
            </div>
        <TableContainer component={Paper} className="table">
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell">Full Name</TableCell>
                        <TableCell className="tableCell">Email</TableCell>
                        <TableCell className="tableCell">Phone</TableCell>
                        <TableCell className="tableCell">Destination</TableCell>
                        <TableCell className="tableCell">Status</TableCell>
                        <TableCell className="tableCell">Assigned To</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignedEnquiries.map((enquiry) => (
                        <TableRow key={enquiry._id}>
                            <TableCell className="tableCell">{enquiry.userName}</TableCell>
                            <TableCell className="tableCell">{enquiry.emailID}</TableCell>
                            <TableCell className="tableCell">{enquiry.phoneNo}</TableCell>
                            <TableCell className="tableCell">{enquiry.destinationName}</TableCell>
                            <TableCell className="tableCell" component={Link} to={`/enquiry/${enquiry._id}`} style={{textDecoration: "none"}}>
                                <span className={`status ${enquiry.status.toLowerCase()}`}>{enquiry.status}</span>
                            </TableCell>
                            <TableCell className="tableCell">{enquiry.assignedTo}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    )
}

export default AssignedTable;