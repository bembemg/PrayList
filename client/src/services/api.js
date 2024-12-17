import axios from "axios";

const mainAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

const listAPI = axios.create({
    baseURL: import.meta.env.VITE_API_LISTURL
});

const setupInterceptors = (apiInstance) => {
    apiInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}; 

setupInterceptors(mainAPI); 
setupInterceptors(listAPI);

export { mainAPI, listAPI };