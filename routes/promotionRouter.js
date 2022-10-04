const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 400;
    res.end("PUT operation is not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send promotion ${req.params.promotionId} to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations is not allowed here`);
  })
  .put((req, res) => {
    res.end(
      `Will update the promotion ${req.params.promotionId} with : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Delete promotion ${promotionId}`);
  });
module.exports = promotionRouter;
