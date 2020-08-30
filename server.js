const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();
const port = 8000;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(middlewares);

server.use(router);

server.listen(port, () => {
    console.log('Run API Server on port', port);
})