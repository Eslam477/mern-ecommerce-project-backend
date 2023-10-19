import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import mongose from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import collectionRouts from "./routes/index.js";
import helmet from "helmet";
/*-----------------setup------------------*/
const app = express();
const config = dotenv.config().parsed
const port = config.SERVER_PORT;
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(cors())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
if (process.env.NODE_ENV === 'production') {
    app.use(helmet()) // for security
}


/*-----------------app------------------*/

app.use('/collection', collectionRouts)

mongose.connect(config.DB_CONNECTION).then(() => {
    app.listen(port, () => { console.log(`The server run at http://localhst:${port}`) })
}).catch(() => {
    process.exit();
})