import mysql from "mysql";

var vendor_db_connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'lorial-vendor'
});

vendor_db_connection.connect(function(err) {
  if (err) throw err;
  else console.log("Database connected successfully!...........................................");
}); 

export default vendor_db_connection