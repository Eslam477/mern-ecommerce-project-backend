import { Router } from "express";
import { userRegister, userLogin, isAdminF } from '../../controllers/user/index.js';
var auth = Router();
auth.post('/register', userRegister)
auth.post('/login', userLogin)
auth.post('/isAdminF', isAdminF)


export default auth;