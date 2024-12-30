import axios from 'axios';

var token = localStorage.getItem('access_token')
const axiosInstance = axios.create({
    baseURL: 'http://192.168.0.201:8000/api/v1/',
    withCredentials: false,
    headers: {
        "Authorization": `Bearer ${token}`
    },
})

export default axiosInstance;
