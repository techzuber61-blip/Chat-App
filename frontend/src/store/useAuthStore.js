import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,

    isSigningUp: false,
    isLoggingIn: false,
    onlineUsers: [],


    checkAuth: async () => {
        try{
            const res = await axiosInstance.get('/api/auth/check');
            set({authUser: res.data})
        } catch (error) {
            console.log("Error in checkAuth ",error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post('/api/auth/signup', data);
            set({authUser: res.data});

            toast.success('Account created successfully!');
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in signup ",error)
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/api/auth/login', data);
            set({authUser: res.data});

            toast.success('Logged In successfully!');
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in Login ",error)
        } finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/api/auth/logout');
            toast.success('Logged Out successfully!');
            set({authUser: null});
        } catch (error) {
            console.log("Error in logout ",error)
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put('/api/auth/update-profile', data);
            set({authUser: res.data});
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.log("Error in updateProfile ",error)
        }
    }
}))