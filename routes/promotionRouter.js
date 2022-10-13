const express = require("express");
const promotionRouter = express.Router();
const Promotion = require("../models/Promotion");
promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => {
        next(e);
      });
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log(" Promotion created", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => {
        next(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /promotions");
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => {
        next(e);
      });
  });

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;

        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
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
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((promotion) => {
        res.statusCode = 200;

        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => {
        next(e);
      });
  })
  .delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => {
        next(e);
      });
  });
module.exports = promotionRouter;
