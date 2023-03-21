import { Router } from "express";
import { userRegister, userLogin } from '../../controllers/user/index.js';
var auth = Router();
auth.post('/register', userRegister)
auth.post('/login', userLogin)


export default auth;