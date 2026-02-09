import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === "true",

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/api/message/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            console.log("Error in getAllContacts ", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMyChatPartners: async() => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/api/message/chats");
            set({ chats: res.data });
        } catch (error) {
            console.log("Error in getMyChatPartners ", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (id) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/api/message/${id}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in getMessagesByUserId ", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const {authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.message,
            image: messageData.image,
            createdAt: new Date(),
            isOptimistic: true
        }

        set({messages: [...messages, optimisticMessage]})

        try {
            const res = await axiosInstance.post(`/api/message/send/${selectedUser._id}`, messageData);
            // set({ messages: [...get().messages, res.data] });
            set({messages: messages.concat(res.data)})
        } catch (error) {
            set({messages: messages})
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
}));