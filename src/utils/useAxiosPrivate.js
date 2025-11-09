"use client"
import axios from "axios";
import { useRouter } from "next/navigation";


const AxiosSecure = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
})

const useAxiosSecure = () => {

    const navigate = useRouter()

    AxiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('Acces-Token')
        config.headers.authorization = `bearer ${token}`
        return config;

    }, function (error) {
        return Promise.reject(error)
    })

    AxiosSecure.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, async function (error) {

        const status = error.response.status;
        if(status === 401 || status === 403){
            await logOutUser();
            navigate('/login')

        }
        
        
        return Promise.reject(error);
    });
    return AxiosSecure;
};

export default useAxiosSecure;