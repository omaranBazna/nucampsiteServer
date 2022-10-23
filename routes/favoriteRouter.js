const express = require("express");
const favoriteRouter = express.Router();
const authenticate = require("./authenticate");
const cors = require("./cors");
const Favorite = require("../models/Favorite");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res
          .statusCode(200)
          .setHeader("Content-type", "application/json")
          .json(favorite);
      })
      .catch((e) => next(e));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.foreach((fav) => {
            if (!favorite.campsites.includes(fav._id)) {
              favorite.campsites.push(fav._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((e) => next(e));
        } else {
          Favorite.create({ user: req.user._id })
            .then((favorite) => {
              favorite.campsite = req.body;

              favorite
                .save()
                .then((favorite) => {
                  res
                    .statusCode(200)
                    .setHeader("Content-Type", "application/json")
                    .json(favorite);
                })
                .catch((e) => next(e));
            })
            .catch((e) => next(e));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        res.setCode(200);
        if (favorite) {
          res.setHeader("Content-Type", "application/json").json(favorite);
        } else {
          res
            .setHeader("Content-Type", "application/json")
            .json("No favorite to delete");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {})
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsite.includes(req.params.campsiteId)) {
            favorite.campsite.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res
                  .statusCode(200)
                  .setHeader("Content-Type", "application/json")
                  .json(favorite);
              })
              .catch((e) => next(e));
          } else {
            res
              .statusCode(200)
              .setHeader("Content-Type", "text/plain")
              .end("That campsite already exists!!");
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((e) => next(e));
        }
      })
      .catch((e) => next(e));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        const index = favorite.campsites.indexOf(req.params.campsiteId);
        if (index > -1) {
          favorite.campsite.splice(index, 1);
          favorite
            .save()
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((e) => next(e));
        } else {
          res
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((e) => next(e));
        }
      } else {
        res
          .statusCode(200)
          .setHeader("Content-Type", "text/plain")
          .end("no favorite to delete");
      }
    });
  });
module.exports = favoriteRouter;
