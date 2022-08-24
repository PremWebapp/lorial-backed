import mysql from "mysql";

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'lorial'
});

connection.connect(function(err) {
  if (err) throw err;
  else console.log("Database connected successfully!...........................................");
}); 

export default connection