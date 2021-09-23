const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.get("/api", (req, res) => {
  res.json({
    message: "waiting for api calls",
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  //   res.send(!!req.headers["authorization"]);
  if (!!bearerHeader) {
    const [, token] = bearerHeader.split(" ");
    req.token = token;
    next();
    // res.send(token);
  } else {
    res.status(403).send("Authorization required");
  }
}
app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    name: "chomba",
    email: "dev.chomba@gmail.com",
  };
  jwt.sign(
    { user },
    process.env.JWT_SECRETE_KEY,
    { expiresIn: "60s" },
    (err, token) => {
      res.json({ token });
    }
  );
});

app.post("/api/posts", verifyToken, (req, res) => {
  const token = req.token;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);

    res.json({
      messgae: "authenticated",
    });
  } catch (err) {
    res.status(403).send(err.message);
  }
});

app.listen(5000, () => {
  console.log("running at port 5000");
});
