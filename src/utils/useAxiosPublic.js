import axios from 'axios';

const AxiosPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
})

const useAxiosPublic = () => {
    return AxiosPublic;
};

export default useAxiosPublic;