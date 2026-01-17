import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerAdmin = (data: { name: string; email: string; password: string }) => API.post("/auth/register-admin", data);

export const registerUser = (data: { name: string; email: string; password: string }) => API.post("/auth/register", data);

export const login = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const getProjects = () => API.get("/auth/projects");
export const getProjectById = (id: string) => API.get(`/auth/projects/${id}`);
export const createProject = (formData: FormData) => API.post("/auth/projects", formData);
export const updateProject = (id: string, formData: FormData) => API.put(`/auth/projects/${id}`, formData);
export const deleteProject = (id: string) => API.delete(`/auth/projects/${id}`);
export const getHomeProjects = () => API.get("/projects/homepage/list");

export const getTeam = () => API.get("/team");
export const getTeamMemberById = (id: string) => API.get(`/team/${id}`);
export const createTeamMember = (formData: FormData) => API.post("/team", formData);
export const updateTeamMember = (id: string, formData: FormData) => API.put(`/team/${id}`, formData);
export const deleteTeamMember = (id: string) => API.delete(`/team/${id}`);

export const getPress = () => API.get("/press");
export const getPressById = (id: string) => API.get(`/press/${id}`);
export const createPress = (formData: FormData) => API.post("/press", formData);
export const updatePress = (id: string, formData: FormData) => API.put(`/press/${id}`, formData);
export const deletePress = (id: string) => API.delete(`/press/${id}`);

export const getStudios = () => API.get("/studio");
export const getStudioById = (id: string) => API.get(`/studio/${id}`);
export const createStudio = (formData: FormData) => API.post("/studio", formData);
export const updateStudio = (id: string, formData: FormData) => API.put(`/studio/${id}`, formData);
export const deleteStudio = (id: string) => API.delete(`/studio/${id}`);

export default API;
