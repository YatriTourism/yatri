import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Tables from "../../components/tables/Tables";
import Widget from "../../components/widget/Widget";
import axios from 'axios';
import "./home.scss";

const Home = () => {

  const [userCount, setUserCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);
  const fetchCounts = useCallback(async () => {
    try {
      const userResponse = await axiosInstance.get('/users/doc/count');
      setUserCount(userResponse.data.totalCount);

      const packageResponse = await axiosInstance.get('/packages/doc/count');
      setPackageCount(packageResponse.data.totalCount);

      const enquiryResponse = await axiosInstance.get('/enquiry/doc/count');
      setEnquiryCount(enquiryResponse.data.totalCount);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);
  const statusFilter = ["Pending","Checked"];
 



  return (
    <div>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <div className="widgets">
          <Widget type="user" count={userCount} />
          <Widget type="package" count={packageCount} />
          <Widget type="enquiry" count={enquiryCount} />
        </div>
          <div className="listContainer">
            <div className="listTitle">Enquiries</div>
            <Tables statusFilter={statusFilter}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
