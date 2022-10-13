const express = require("express");
const partnerRouter = express.Router();
const Partner = require("../models/Partner");
partnerRouter
  .route("/")
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((e) => {
        next(e);
      });
  })
  .post((req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log(" Partner created", partner);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => {
        next(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /partners");
  })
  .delete((req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => {
        next(e);
      });
  });

partnerRouter
  .route("/:partnerId")
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;

        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => {
        next(e);
      });
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations is not allowed here`);
  })
  .put((req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((partner) => {
        res.statusCode = 200;

        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => {
        next(e);
      });
  })
  .delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => {
        next(e);
      });
  });
module.exports = partnerRouter;
