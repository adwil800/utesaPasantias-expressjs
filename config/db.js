let mysql = require('mysql');

let con;
const connectDB = () => {

    con =  mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pasantias"
    });

    con.connect((err)=>{

        if(err) throw err;
        //console.log("Connected");
    });

 
};
        
//Returns json array with rows
const getQueryDB =  (query) => {
    connectDB();
    return new Promise((resolve, reject) => {

        con.query(query, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.sqlMessage);//throw err;
            }
            else{
                con.end();
                return resolve(Object.values(JSON.parse(JSON.stringify(rows))));
                
            }
    
        });

    });
   


};



   //Returns inserte ID as a number
const postQueryDB = (query) => {
    connectDB();

    return new Promise((resolve, reject) => {

        con.query(query, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.sqlMessage);//throw err;
            }
            else{
                con.end();
                return resolve(rows.insertId);
            }
    
        });

    });

};
   //async to follow the flow of connect -> query -> end connection
const execProcedure = (procedure) => {
    connectDB();

    return new Promise((resolve, reject) => {

        con.query("call "+procedure, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.errno) 
            }
            else{
                con.end();
                return resolve(rows.insertId);
            }
    
        });

    });

};

module.exports = {getQueryDB, postQueryDB, execProcedure};


