import axios from "axios";

// Authentication API
const AuthAPI = axios.create({
  baseURL: "http://192.168.1.141:3001/auth",
});

const AvatarAPI = axios.create({
  baseURL: "http://192.168.1.141:3001/avatar",
});

//Api Avatar generation
const AvatarGen = axios.create({
  baseURL: "http://192.168.1.71:8083/avatar_gen/",
});

// Global Error Handling for Both APIs
const handleError = (error: { response: { data: any; }; message: any; }) => {
  console.error("API Error:", error.response?.data || error.message);
  return Promise.reject(error);
};

AuthAPI.interceptors.response.use((response) => response, handleError);
AvatarAPI.interceptors.response.use((response) => response, handleError);
AvatarGen.interceptors.response.use((response) => response, handleError);

export { AuthAPI, AvatarAPI, AvatarGen };
