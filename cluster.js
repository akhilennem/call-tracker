const cluster = require("cluster");
const os = require("os");
const http = require("http");
const path=require('path')
const numCPUs = os.cpus().length;

cluster.setupPrimary({
    exec: path.join(__dirname, "app.js"), 
  });


if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting.`);
        cluster.fork();
    });

} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from Worker ${process.pid}\n`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
