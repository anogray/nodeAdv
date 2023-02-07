const cluster = require("cluster");
const http = require("http");
const cpuCount = require("os").cpus().length; //returns no of cores our cpu have

console.log({cpuCount});

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master process ${process.pid} is running`);

  //fork workers.

  for (let i = 0; i < cpuCount; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork(); //creates new node js processes
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); //forks a new process if any process dies
  });
}

function childProcess() {
  const express = require("express");
  const app = express();
  //workers can share TCP connection

  app.get("/", (req, res) => {
    res.send(`hello from server ${process.pid}`);
  });

  app.get("/getfibonacci", (req, res) => {

    const {number=20}=req.query;
  
    const startTime = new Date();
    const result = fibonacci(parseInt(number)); //parseInt is for converting string to number
    const endTime = new Date();
    res.json({
      number: parseInt(req.query.number),
      fibonacci: result,
      time: endTime.getTime() - startTime.getTime() + "ms",
      processId:process.pid
    });
  });
  
  app.get("/testrequest", (req, res) => {
    res.send("I am unblocked now");
  });
  
  const fibonacci = n => {
    if (n <= 1) {
      return 1;
    }
  
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  app.listen(5555, () =>
    console.log(`server ${process.pid} listening on port 5555`)
  );
}