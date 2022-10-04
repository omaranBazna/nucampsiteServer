const express = require("express");
const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the partners to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the partner : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 400;
    res.end("PUT operation is not supported on /partners");
  })
  .delete((req, res) => {
    res.end("Deleting all partners");
  });

partnerRouter
  .route("/:partnerId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send partner ${req.params.partnerId} to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations is not allowed here`);
  })
  .put((req, res) => {
    res.end(
      `Will update the partner ${req.params.partnerId} with : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Delete partner ${partnerId}`);
  });
module.exports = partnerRouter;
