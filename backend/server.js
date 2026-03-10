const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'planner'
}


//handle plan table insertion
async function insertPlan(plan) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = 'INSERT INTO plan (plan_date, t_start, t_end, plan, usr_id) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.query(sql, [plan.dateValue, plan.startTime, plan.endTime, plan.planValue, plan.usrID]);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (connection) connection.end();
  }
}



const server = http.createServer((req, res) => {

    // routing for post methods

    if(req.method === "POST" && req.url === "/api/plans") {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const planData = JSON.parse(body);

          const result = await insertPlan(planData);

          res.writeHead(200, { 'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            message: 'Plan inserted successfully',
            planId: result.insertId
          }));

        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error inserting plan'}));
        }
      });
      return;
    }


  // routing for get methods

    let filePath = path.join(__dirname, '../frontend/', req.url);

    let contentType = 'text/html';

    if(req.method === "GET" && req.url === "/") {
      filePath = path.join(__dirname, '../frontend/', '/index.html');
    }

    if(req.method === "GET" && req.url === "/calendar") {
      filePath = path.join(__dirname, '../frontend/', '/html/calendar.html');
    }

    if(req.method === "GET" && req.url === '/favicon.ico') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (path.extname(filePath) === '.css') contentType = 'text/css';
    if (path.extname(filePath) === '.js') contentType = 'text/javascript';

    res.setHeader('Content-Type', contentType);



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




