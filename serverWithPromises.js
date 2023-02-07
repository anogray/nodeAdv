const express = require("express");
const app = express();

app.get("/isprime", async (req, res) => {
  const {number=1000000007} = req.query;
  const startTime = new Date();
  const result = await isPrime(parseInt(number)); //parseInt is for converting string to number
  const endTime = new Date();
  res.json({
    number: parseInt(req.query.number),
    isprime: result,
    time: endTime.getTime() - startTime.getTime() + "ms",
  });
});

app.get("/testrequest", (req, res) => {
  res.send("I am unblocked now");
});

const isPrime = number => {
  return new Promise(resolve => {
    let isPrime = true;
    let m = number/2;
    for (let i = 2; i <=m; i++) {
      if (number % i === 0) {
        isPrime = false;
        break;
      }
    }

    resolve(isPrime);
  });
};

app.listen(4000, () => console.log("listening on port 4000"));
