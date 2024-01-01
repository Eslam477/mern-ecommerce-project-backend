import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


const generalVerifyToken = (req, res, next) => {
    const requestedUrl = req.originalUrl;
    const config = dotenv.config().parsed
    // const token_secret_key = config.TOKEN_SECRET_KEY;
    const general_token_pass = config.GENERAL_TOKEN_PASS;

    const token = req.header('Authorization');
    const decoded = jwt.decode(token)


    if (requestedUrl.slice(0, 16) === '/collection/img/') {
        next()
    }else{
    if (!token || !decoded || decoded == null) {
        res.status(401).json({ error: 'Access denied' })
    } else {
        if (decoded == general_token_pass) {
            next()
        } else {
            res.status(401).json({ error: 'Unexpected token' })
        }
    }
}
}




export { generalVerifyToken }