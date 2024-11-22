import axios from "axios"

export const loginUser = async (data) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/login`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/signUp`, data)
    return res.data
}