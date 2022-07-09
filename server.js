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


const bEmp = require("./routes/bemp");
const auth = require("./routes/auth");

app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: "1mb"}));
app.use(session({
    secret: "somethingKey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 600000,
        //secure: true 
    }
}));

//Use routes
app.use("/default", defaultData); //Used to insert data that's can't be registered through front


app.use("/bemp", bEmp);
app.use("/auth", auth);





port = 5500;

const server = app.listen(
    port,
    console.log(`Server listening on http://localhost:${port}`)
);











