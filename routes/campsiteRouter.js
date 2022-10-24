const express = require("express");
const campsiteRouter = express.Router();
const authenticate = require("../authenticate");
const Campsite = require("../models/Campsite");
campsiteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.find()
      .populate("comments.author")
      .then((campsites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsites);
      })
      .catch((e) => {
        next(e);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.create(req.body)
        .then((campsite) => {
          console.log("Campsite created", campsite);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite);
        })
        .catch((e) => {
          next(e);
        });
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation is not supported on /campsites");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((e) => {
          next(e);
        });
    }
  );

campsiteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        res.statusCode = 200;

        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((e) => {
        next(e);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(`POST operations is not allowed here`);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findByIdAndUpdate(
        req.params.campsiteId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then((campsite) => {
          res.statusCode = 200;

          res.setHeader("Content-Type", "application/json");
          res.json(campsite);
        })
        .catch((e) => {
          next(e);
        });
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findByIdAndDelete(req.params.campsiteId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((e) => {
          next(e);
        });
    }
  );

campsiteRouter
  .route("/:campsiteId/comments")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        if (campsite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments);
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.statusCode = 400;
          return next(err);
        }
      })
      .catch((e) => {
        next(e);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          req.body.author = req.user._id;
          campsite.comments.push(req.body);
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite.comments);
            })
            .catch((e) => next(e));
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.statusCode = 400;
          return next(err);
        }
      })
      .catch((e) => {
        next(e);
      });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation is not supported on /campsites/${req.params.campsiteId}/comments`
    );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findById(req.params.campsiteId)
        .then((campsite) => {
          if (campsite) {
            for (let i = 0; i < campsite.comments.length; i++) {
              campsite.comments.id(campsite.comments[i]._id).remove();
            }

            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite.comments);
              })
              .catch((e) => next(e));
          } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.statusCode = 400;
            return next(err);
          }
        })
        .catch((e) => {
          next(e);
        });
    }
  );

campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.statusCode = 400;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.statusCode = 400;
          return next(err);
        }
      })
      .catch((e) => {
        next(e);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
      );
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (
            req.user._id.equals(
              campsite.comments.id(req.params.commentId).author._id
            )
          ) {
            if (req.body.rating) {
              campsite.comments.id(req.params.commentId).rating =
                req.body.rating;
            }
            if (req.body.text) {
              campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((e) => next(e));
          } else {
            err = new Error(
              `you are not authorized to change/rate this comment`
            );
            err.statusCode = 400;
            return next(err);
          }
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.statusCode = 400;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.statusCode = 400;
          return next(err);
        }
      })
      .catch((e) => {
        next(e);
      });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (
            req.user._id.equals(
              campsite.comments.id(req.params.commentId).author._id
            )
          ) {
            campsite.comments.id(req.params.commentId).remove();

            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((e) => next(e));
          } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.statusCode = 400;
            return next(err);
          } else {
            err = new Error(
              `you are not authorized to change/rate this comment`
            );
            err.statusCode = 400;
            return next(err);
          }
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.statusCode = 400;
          return next(err);
        }
      })
      .catch((e) => {
        next(e);
      });
  });
module.exports = campsiteRouter;
