import "./dataTable.scss";
import {DataGrid} from "@mui/x-data-grid";
import { Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import  "react-toastify/dist/ReactToastify.css";

const DataTable = ({columns, rows}) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);  
  const {data} = useFetch(`/${path}`);
  const dataGridRef = useRef(null);
  const isEnquiryPage = location.pathname === "/enquiry";

  const axiosInstance = useMemo(() => {
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
}, []);

  const navigate = useNavigate();
  
  useEffect(() => {
    setList((rows || data).slice().reverse());
  }, [rows, data]);
  
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(""); 
 
  useEffect(() => {
    const fetchAdminNames = async () => {
      try {
        const response = await axiosInstance.get("/users/doc/admindetails");
        const usernames = response.data.map(admin => admin.username);
        setAdminNames(usernames);
      } catch (error) {
        console.error("Error fetching admin names:", error);
      }
    };
  
    if (isEnquiryPage) {
      fetchAdminNames();
    }
  }, [isEnquiryPage,axiosInstance]);

  

  const handleDelete = async(id) =>{
    try {
      await axiosInstance.delete(`/${path}/${id}`);
      toast.success(" Deleted successfully!")
      setList(list.filter(item=> item._id !== id))
      
    } catch (error) {
      console.error("Error deleting item",error)
    }
  }

    const actionColumn=[
      {
        field:  'action',
        headerName: 'Action',
        width: 150,
        renderCell: (params) =>{
            return(
                <div className="cellAction">
                  <Link to={`/${path}/${params.row._id}`} style={{'textDecoration':'none'}}>
                    <button className="viewButton">View</button>
                  </Link>
                    <button className="deleteButton" onClick={() => handleDelete(params.row._id)}>Delete</button>
                </div>
            )
        }
      }
    ];

const [rowSelectionModel, setRowSelectionModel] = useState([]);

const handleRowSelectionModelChange = (newSelectionModel) => {
  setRowSelectionModel(newSelectionModel);
}

const handleDeleteAll = async () => {
  try {
    if (rowSelectionModel.length === 0) {
      alert("Please select at least one enquiry.");
      return;
    }

    const response = await axiosInstance.delete("enquiry/delete/multiple", {
      data: { enquiryIDs: rowSelectionModel },
    });
    toast.success(" Deleted successfully!")
    console.log(response.data); 
    setList(list.filter((enquiry) => !rowSelectionModel.includes(enquiry._id)));
    setRowSelectionModel([]); 
  } catch (error) {
    console.error("Error deleting enquiries:", error);
  }
};

const handleAssignTo = async () => {
  try {
    if (!selectedAdmin) {
      toast.info("Please select an admin.");
      return;
    }

    if (rowSelectionModel.length === 0) {
      toast.info("Please select at least one enquiry.");
      return;
    }

    await axiosInstance.post('enquiry/assignEnquiries', {
      adminID: selectedAdmin, 
      enquiryIDs: rowSelectionModel 
    });

    toast.success("Enquiries assigned successfully!", {
      onClose: () => {
        navigate("/enquiry");
        setTimeout(() => {
          window.location.reload();
        }, 0); // You can adjust the timeout duration if needed
      },
      autoClose: 1000,
    });
  } catch (error) {
    console.error('Error assigning enquiries:', error);
  }
};

  return (
    <div className="dataTable">
      <ToastContainer />
      <div className="dataTableTitle">
        <p id="path">{path.toUpperCase()} RECORDS</p>
        {path === "packages" && 
        (
        <Link to={`/${path}/new`} style={{'textDecoration':'none', "marginRight":"20px", "color": "#28a745"}} className="link">
          Add new
        </Link>
        )}
      </div>
        <DataGrid
        className="dataGrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15]}
        checkboxSelection
        getRowId={row=>row._id}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={rowSelectionModel}
        ref={dataGridRef}
      />
      {path === "enquiry" && 
          <div className="assignTo">
          <button onClick={handleAssignTo}>Assign To</button>
          <select className="adminDropdown" value={selectedAdmin} onChange={(e) => setSelectedAdmin(e.target.value)}>
              <option value="">Select Admin</option>
              {adminNames.map((adminName, index) => (
                <option key={index} value={adminName}>
                  {adminName}
                </option>
              ))}
            </select>
            <button className="DeleteAll" onClick={handleDeleteAll}>Delete All</button>
        </div>
        }        
    </div>
  )
}

export default DataTable;