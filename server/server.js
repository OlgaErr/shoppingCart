const express = require('express');
const bodyParser = require("body-parser");
const pg = require('pg');
const PGClient = require('pg').Client;
const { pgConfig } = require('./config');

const client = new PGClient(pgConfig);

client.connect();

const app = express();
const PORT = process.env.PORT = 3002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/../client/app" } );
});

app.get('/api/users', function(req, res){
  client.query('SELECT * FROM users;', [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

// CLIENT_SIDE CREATE USER
// const b = JSON.stringify({user: 'test_1', password: 1234, name: 'test_1', group: 'test_1', email: ''});
// fetch('/api/users', {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
//   body: b
// }).then(response => response.json())
//   .then(data => console.log(data))

app.post('/api/users', function(req,res){
  const { user, password, name, group, email } = req.body;
  client.query(
    `INSERT INTO users ("user", "password", "name", "group", "email", "createdAt") VALUES('${user}', ${password}, '${name}', '${group}', '${email}', CURRENT_TIMESTAMP) RETURNING *;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows[0]);
  })
});

app.get('/api/users/:user_id', function(req, res){
  client.query(`SELECT * FROM users WHERE user_id = ${req.params.user_id};`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

// CLIENT_SIDE CREATE USER'S LIST
// const data = JSON.stringify({name: 'test_list', message: '1234'});
// fetch('/api/users/1/lists', {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
//   body: data
// }).then(response => response.json())
//   .then(data => console.log(data))

app.post('/api/users/:user_id/lists', function(req,res){
  const { name, message } = req.body;
  client.query(
    `INSERT INTO lists ("name", "createdAt", "updatedAt", "archived", "message", "user_id") VALUES('${name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, '${message}', ${req.params.user_id}) RETURNING *;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows[0]);
  })
});

// CLIENT_SIDE GET USER'S list
// fetch('/api/users/1/lists')
// .then(response => response.json())
// .then(data => {
//   console.log(data)
// })
// .catch(error => console.error(error))

app.get('/api/users/:user_id/lists', function(req, res){
  client.query(`SELECT * FROM lists WHERE user_id = ${req.params.user_id};`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

app.get('/api/lists', function(req, res){
  client.query(`SELECT * FROM lists;`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

app.get('/api/lists/:list_id', function(req, res){
  client.query(`SELECT * FROM lists WHERE list_id = ${req.params.list_id};`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

// CLIENT_SIDE UPDATE ARCHIVED parametr of the list
// const data = JSON.stringify({ archived: false }); //may be changed to true/false
// fetch('/api/lists/1', {
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },
//   method: 'PATCH',                                                              
//   body: data                                        
// }).then(response => response.json())
//   .then(data => console.log(data))

app.patch('/api/lists/:list_id', function(req, res){
  const { archived } = req.body;
  client.query(`UPDATE lists SET archived = ${archived} WHERE list_id = ${req.params.list_id} RETURNING *;`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows);
  })
});

//if you will get 202 status that means that list was successfully deleted
app.delete('/api/lists/:list_id', function(req, res){
  client.query(`DELETE FROM lists WHERE "list_id" = ${req.params.list_id};`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.status(202).json([]);  //if ok then return empty array
  })
});

app.post('/api/categories', function(req,res){
  const { name } = req.body;
  client.query(
    `INSERT INTO category ("category_name") VALUES('${name}') RETURNING *;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows[0]);
  })
});

app.get('/api/categories', function(req, res){
  client.query(`SELECT * FROM category;`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

app.post('/api/products', function(req,res){
  const { name, category_id } = req.body;
  client.query(
    `INSERT INTO products ("product_name", "category_id") VALUES('${name}', ${category_id}) RETURNING *;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows[0]);
  })
});

app.get('/api/products', function(req, res){
  client.query(`SELECT * FROM products;`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

app.get('/api/categoryandproducts', function(req, res){
  client.query(
    `SELECT category.category_name, products.product_name FROM category INNER JOIN products ON products.category_id = category.category_id;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows)
  })
});

// CLIENT_SIDE ADD ELEMENT TO LIST
// var b = JSON.stringify({ amount: 1.0, category_name: "FISH3", discount: false, price: 1.0, product_name: "COD3", shop: "" });
// fetch('/api/lists/1/elements', {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
//   body: b
// }).then(response => response.json())
//   .then(data => console.log(data))

app.post('/api/lists/:list_id/elements', function(req,res){
  const { category_name, product_name, amount, price, shop, discount } = req.body;
  client.query(
    `INSERT INTO elements (category_name, product_name, amount, price, shop, discount, list_id)
    VALUES('${category_name}', '${product_name}', ${amount || 1.0}, ${price || 1.0}, '${shop}', ${discount || false}, ${req.params.list_id}) RETURNING *;`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows[0]);
  })
});

app.get('/api/lists/:list_id/elements', function(req, res){
  client.query(`SELECT position_id, category_name, product_name, amount, price, shop, discount FROM elements WHERE list_id = ${req.params.list_id};`, [], function (err, result) {
    if (err) {
      // Передача ошибки в обработчик express
      return res.status(500).json(err);
    }
    res.json(result.rows)
  })
});

// CLIENT_SIDE REMOVE A ELEMENT FROM THE LIST
// fetch('/api/lists/2/elements/5', { method: 'delete'})
// .then(response => response.json());

app.delete('/api/lists/:list_id/elements/:position_id', function(req, res){
  client.query(`DELETE FROM elements WHERE "position_id" = ${req.params.position_id};`,
    [],
    function (err, result) {
      if (err) {
        // Передача ошибки в обработчик express
        return res.status(500).json(err);
      }
      res.json(result.rows)  //if ok then return empty array
  })
});

app.use(express.static(`${__dirname}/../client/app`));

app.listen(PORT, () => {
  console.log('Server is running at:', PORT);
});
