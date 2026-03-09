const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer((req, res) => {

    let filePath = path.join(__dirname, '../frontend/', req.url);

    let contentType = 'text/html';

    if(req.url === "/") {
      filePath = path.join(__dirname, '../frontend/', '/index.html');
    }

    if(req.url === "/calendar") {
      filePath = path.join(__dirname, '../frontend/', '/html/calendar.html');
    }

    if (req.url === '/favicon.ico') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (path.extname(filePath) === '.css') contentType = 'text/css';
    if (path.extname(filePath) === '.js') contentType = 'text/javascript';

    res.setHeader('Content-Type', contentType);

 
    console.log(filePath);
    console.log("URL: " + req.url);

    fs.readFile(filePath , (err, data) => {
      if(err) {
        console.log(err);
        res.end();
        return;
      } 
      res.end(data);
    })


}); 




server.listen(3000, 'localhost', () => {
  console.log('listening to requests on port 3000');
})


const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'planner'
})

connection.connect((err) => {
  if(err) throw err;
  console.log('Connected to MySQL database');
})
