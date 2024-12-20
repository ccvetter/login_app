import axios from 'axios';

var token = localStorage.getItem('access_token')
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    withCredentials: false,
    headers: {
        "Authorization": `Bearer ${token}`
    },
})

export default axiosInstance;
