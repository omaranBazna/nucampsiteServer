const express = require("express");
const campsiteRouter = express.Router();

campsiteRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the campsites to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the campsite : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 400;
    res.end("PUT operation is not supported on /campsites");
  })
  .delete((req, res) => {
    res.end("Deleting all campsites");
  });

campsiteRouter
  .route("/:campsiteId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.header("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send campsite ${req.params.campsiteId} to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations is not allowed here`);
  })
  .put((req, res) => {
    res.end(
      `Will update the campsite ${req.params.campsiteId} with : ${req.body.name} with description : ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Delete campsite ${campsiteId}`);
  });
module.exports = campsiteRouter;
