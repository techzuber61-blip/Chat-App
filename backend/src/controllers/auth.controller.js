import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { ENV } from "../lib/env.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/User.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "Please fill all fields"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Please enter a valid email"})
        }


        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePic: savedUser.profilePic
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            } catch (error) {
                console.error("Error sending welcome email", error);
            }
        } else {
            return res.status(400).json({message: "Invalid user data"})
        }

        
    } catch (error) {
        console.log("Error in signup controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        if(!email || !password) {
            return res.status(400).json({message: "Please fill all fields"})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const logout = async (_, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: ENV.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 0
    })

    res.status(200).json({message: "Logged out successfully"})

    /*try {
        res.clearCookie('jwt')
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }*/
}