import axios from "axios";

// Creating Axios instance
const Api = axios.create({
    baseURL: "http://localhost:5500",
});

// Function to get the config with the latest token
const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data'
        }
    };
}

// Creating test API
export const testApi = () => Api.get("/test");

// Creating register API
export const registerApi = (data) => Api.post("/api/user/register", data);

// Creating login API
export const loginApi = (data) => Api.post("/api/user/login", data);

export const getUserProfileApi = (userId) => Api.get(`/api/user/profile/${userId}`, getConfig());

export const verifyEmailApi = (token) => Api.get(`/verify-email/${token}`);

// Creating add data API
export const addDataApi = (formData) => Api.post("/api/data/create_data", formData, getConfig());

export const getAllDataApi = () => Api.get('/api/data/get_data', getConfig());

export const getSingleDataApi = (id) => Api.get(`/api/data/get_data/${id}`, getConfig());

export const updateDataApi = (id, formData) => Api.put(`/api/data/update_data/${id}`, formData, getConfig());

export const deleteDataApi = (id) => Api.delete(`/api/data/delete_data/${id}`, getConfig());

export const getAllUsers = () => Api.get("/api/user/getAll", getConfig());

export const deleteUserApi = (id) => Api.delete(`/api/user/delete_data/${id}`, getConfig());

export const forgetApi = (data) => Api.post("/api/auth/forgot-password", data);

export const resetApi = (data) => Api.post("/api/auth/reset-password",data)

export const getAuditLogsApi = () => Api.get("/api/audit-logs", getConfig());

export default Api;
