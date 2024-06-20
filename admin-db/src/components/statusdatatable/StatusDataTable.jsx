import "./statusdataTable.scss"
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EnquiryStatusTable = ({columns, status }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [adminNames, setAdminNames] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState("");
    const dataGridRef = useRef(null);
    const navigate = useNavigate();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: process.env.REACT_APP_API_URL,
        });
    }, []);
   
    const handleRowSelectionModelChange = (newSelectionModel) => {
        setRowSelectionModel(newSelectionModel);
    } 

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await axiosInstance.get(`/enquiry/status/${status}`);
                setEnquiries(response.data.enquiries.slice().reverse());
            } catch (error) {
                toast.error("Error fetching enquiries.");
            }
        };

        fetchEnquiries();
    }, [status,axiosInstance]);

    useEffect(() => {
        const fetchAdminNames = async () => {
            try {
                const response = await axiosInstance.get("/users/doc/admindetails");
                const usernames = response.data.map(admin => admin.username);
                setAdminNames(usernames);
            } catch (error) {
                console.error("Error fetching admin names:", error);
                toast.error("Error fetching admin names.");
            }
        };

        fetchAdminNames();
    }, [axiosInstance]);

    const handleAssignTo = async () => {
        try {
          if (!selectedAdmin) {
            toast.error("Please select an admin.");
            return;
          }
      
          if (rowSelectionModel.length === 0) {
            toast.error("Please select at least one enquiry.");
            return;
          }
      
          await axiosInstance.post("enquiry/assignEnquiries", {
            adminID: selectedAdmin,
            enquiryIDs: rowSelectionModel,
          });
      
          toast.success("Enquiries assigned successfully!", {
            onClose: () => {
              setTimeout(() => {
                window.location.reload();
              }, 0); // Adjust the timeout duration if needed
            },
            autoClose: 1500,
          });
        } catch (error) {
          toast.error("Error assigning enquiries.");
        }
      };
      

    const handleStatusClick = (enquiryID) => {
        navigate(`/enquiry/${enquiryID}`);
    };

    const modifiedColumns = columns.map((column) => {
        if (column.field === 'status') {
            return {
                ...column,
                renderCell: (params) => (
                    <div 
                        className={`status ${params.value?.toLowerCase()}`} 
                        onClick={() => handleStatusClick(params.row._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {params.value}
                    </div>
                ),
            };
        }
        return column;
    });

    return (
        <div className="statusDataTable">
            <ToastContainer />
            <DataGrid
                className="dataGrid_"
                rows={enquiries}
                columns={modifiedColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                getRowId={row=>row._id}
                onRowSelectionModelChange={handleRowSelectionModelChange}
                rowSelectionModel={rowSelectionModel}
                ref={dataGridRef}
            />

            <div className="assignTo_">
                <button onClick={handleAssignTo}>Assign To</button>
                <select
                    className="adminDropdown_"
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                >
                    <option value="">Select Admin</option>
                    {adminNames.map((adminName, index) => (
                        <option key={index} value={adminName}>
                            {adminName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default EnquiryStatusTable;
