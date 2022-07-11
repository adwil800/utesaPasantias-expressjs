const express = require("express");
const session = require("express-session");
    
var cors = require('cors');

const app = express();
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));

//Import routes
const defaultData = require("./routes/defaultData");


const pasantia = require("./routes/pasantia");
const auth = require("./routes/auth");

app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: "1mb"}));
app.use(session({
    secret: "somethingKey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 6000000,
        //secure: true 
    }
}));

const {testDBConnection} = require("./config/db");

//Middleware
app.use(testDBConnection);


//Use routes
app.use("/api/default", defaultData); //Used to insert data that's can't be registered through front
app.use("/api/pasantia", pasantia);
app.use("/api/auth", auth);


port = 5500;

const server = app.listen(
    port,
    console.log(`Server listening on http://localhost:${port}`)
);








