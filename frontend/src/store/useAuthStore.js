import {create} from 'zustand'

export const useAuthStore = create((set) => ({
    authUser: {name: "", email: ""},
    isLoggedIn: false,

    login: () => {
        console.log("Login function called");
        set({isLoggedIn: true})
    }
}))