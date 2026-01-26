import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { getAdmin } from '../controller/userController.js'
import adminAuth from '../middleware/adminAuth.js'

let userRoutes = express.Router()

userRoutes.get("/getadmin",adminAuth,getAdmin)



export default userRoutes