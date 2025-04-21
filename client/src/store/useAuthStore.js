import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,
  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", signupData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("Signup successfull");
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("login successfull");
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("auth/logout");
      disconnectSocket();
      if (res.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      initializeSocket(res.data.user._id);
      console.log(res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
