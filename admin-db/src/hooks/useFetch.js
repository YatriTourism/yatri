import { useEffect, useMemo, useState } from "react";
import  axios from 'axios';

const useFetch = (url) =>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: process.env.REACT_APP_API_URL,
        });
    }, []);

    useEffect(()=> {
        const fetchData = async () =>{
            setLoading(true)
            try {
                const res = await axiosInstance.get(url);
                setData(res.data);
            } catch (err) {
                setError(err)
            }
            setLoading(false);
        };
        fetchData();
    },[url,axiosInstance]);

    const reFetch = async () =>{
        setLoading(true)
        try {
            const res = await axiosInstance.get(url)
            setData(res.data);
        } catch (err) {
            setError(err)
        }
        setLoading(false);
    };

    return {data, loading, error, reFetch};
};

export default useFetch;