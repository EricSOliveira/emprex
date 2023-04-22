const loans = require("./loans.json");
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/loans", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS",
  );

  let perPage = parseInt(req.query.per_page) ? parseInt(req.query.per_page) : 5;

  const pageCount = Math.ceil(loans.length / perPage);
  let page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  if (page > pageCount) {
    page = pageCount;
  }
  res.json({
    page: page,
    pageCount: pageCount,
    loans: loans.slice(page * perPage - perPage, page * perPage),
  });
  // if (!req.headers.authorization) {
  //   return res.status(403).json({ error: 'No credentials sent!' });
  // }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
