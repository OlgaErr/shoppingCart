const express = require('express');

const pg = require('pg');
const PGClient = require('pg').Client;
const {pgConfig} = require('./config');

const client = new PGClient(pgConfig);

client.connect();

const app = express();
const PORT = process.env.PORT = 3002;

app.get('/', function(req, res){
  res.sendfile('index.html', { root: __dirname + "/../client/app" } );
});

app.get('/users', function(req, res){
      client.query('SELECT * FROM users;', [], function (err, result) {
        if (err) {
          // Передача ошибки в обработчик express
          return next(err)
        }
        res.json(result.rows)
      })
});
app.get('/users/:user_id/lists', function(req, res){
    client.query(`SELECT * FROM lists WHERE user_id = ${req.params.user_id};`, [], function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.json(result.rows)
    })
});

app.get('/users/:user_id/lists/:list_id', function(req, res){ //лист пользователя у которого user_id = req.params.user_id

  // SELECT a.id,a.phone,b.device,b.address FROM users as a,devices as b WHERE a.id = b.user_id;
    client.query(`SELECT * FROM public.lists WHERE list_id = ${req.params.list_id};`, [], function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.json(result.rows)
    })
});

app.use(express.static(__dirname + "/../client/app"));

app.listen(PORT, () => {
  console.log('Server is running at:', PORT);
});