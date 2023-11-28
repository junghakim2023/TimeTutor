const mysql = require('mysql'); 
let connection = null;

initDB();

const initDB = function(){
    if (connection == null){
    const conn = {  
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_ADMIN,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE};
     
    
    connection = mysql.createConnection(conn);
    connection.connect();  
    }
}

const getDBConnection = function(){return connection;}

process.on('exit', () => {
    console.log('Closing MySQL connection.');
    connection.end();
  });
  
  process.on('SIGINT', () => {
    console.log('Caught interrupt signal. Closing MySQL connection.');
    process.exit();
  });
 


module.exports = {getDBConnection}