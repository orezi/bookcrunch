'use strict';
require('../models/user.model');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../../config/db');
var session = ('express-session');
var nodemailer = require('nodemailer');

var UserController = function() {}

UserController.prototype.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.json(err);
    }
    if (!users) {
      return res.json({
        success: false,
        message: 'No users found'
      });
    }
    return res.json(users);
  });
};

UserController.prototype.authenticate = function(req, res) {
  User.findOne({
    email: req.body.email
  }).exec(function(err, user) {
    if (err)
      return res.json(err);

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (req.body.password) {
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed.'
        });
      } else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 34560 //24hr expiration
        });
        //return info including token in JSON format
        return res.json({
          success: true,
          message: 'Enjoy your token',
          token: token,
          user: user
        });
      }
    } else {
      return;
    }
  });
};

UserController.prototype.verifyUser = function(req, res) {
  User.findByIdAndUpdate(req.params.userId, {
    $set: {
      verified: true
    }
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    UserController.prototype.sendWelcomeMail(req, res);
    return res.json(user);
  });
}

UserController.prototype.sendWelcomeMail = function(req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'physiocraft.noreply@gmail.com',
      pass: '#Physio.noreply'
    }
  });
  var userId = req.params.userId;
  User.findOne({
    _id: userId
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    if (user) {
      var mailOptions = {
        from: 'Bookcrunch ✔ <no-reply@bookcrunch.com>',
        to: user.email,
        subject: 'Welcome to Bookcrunch',
        text: 'Welcome Email',
        html: '<b> Hello ' + user.firstname + ',\n' +
          'Welcome to bookcrunch! \n' +
          'Your Account details are as follows: \n' +
          'Username: ' + user.firstname + '\n' +
          'Find your books and start reading <a href="https://bookcrunch.herokuapp.com"> here</a>\n' +
          'Enjoy! \n' +
          'The Aegea Team'
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('message sent: ' + info);
        }
      });
    }
  })
};

UserController.prototype.sendVerifyMail = function(req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'physiocraft.noreply@gmail.com',
      pass: '#Physio.noreply'
    }
  });
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.json(err)
    } else if (!user) {
      console.log("no user");
      res.json({
        success: false,
        message: 'No user found'
      });
    } else {
      var mailOptions = {
        from: 'Bookcrunch ✔ <no-reply@bookcrunch.com>',
        to: user.email,
        subject: 'Verify Email',
        text: 'Sign up almost complete',
        html: "<b> Hello " + user.firstname + ",\n Thank you for signing up to Bookcrunch! \n" +
          "Congratulations! Now you are registered on <a href='https://bookcrunch.herokuapp.com'>bookcrunch.com.ng</a> \n" +
          "please, confirm your email by clicking the link below \n" +
          "https://bookcrunch.herokuapp.com/#/nav/verify/" + user._id + "\n" +
          "Please, do not reply to this email. \n" +
          "Thanks for using Bookcrunch \n" +
          "The Aegea Team"
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('message sent: ' + info);
        }
      });
    }
  })
};

UserController.prototype.createUser = function(req, res) {
  if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: 'Check parameters!'
    });
  }
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.json(err);
    } else if (user) {
      res.json({
        success: false,
        message: 'user email taken'
      });
    } else {
      User.create(req.body, function(err, user) {
        if (err) {
          return res.json(err);
        }
        UserController.prototype.sendVerifyMail(req, res);
        res.send(user);
      });
    }
  });
};

UserController.prototype.getCurrentUser = function(req, res) {
  User.findById(req.decoded._doc._id, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
};

UserController.prototype.updateCurrentUser = function(req, res) {
  User.findByIdAndUpdate({
    _id: req.decoded._doc._id
  }, req.body, {
    new: true
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    var token = jwt.sign(user, config.secret, {
      expiresIn: 34560 //24hr expiration
    });

    return res.json({
      user: user,
      token: token
    });
  });
}

UserController.prototype.updatePaidUser = function(req, res) {
  User.findByIdAndUpdate(req.decoded._doc._id, {
    $set: {
      paid: true
    }
  }, function(err, user) {
    if (err) return (err);
    res.send(user);
  });
}

UserController.prototype.deleteCurrentUser = function(req, res) {
  User.remove({
    _id: req.decoded._doc._id
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    return res.json({
      success: true,
      message: "user has been deleted"
    });
  });
};

UserController.prototype.decodeUser = function(req, res) {
  return res.json(req.decoded);
};

UserController.prototype.verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        //if all checks are passed, save decoded info to request
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //show http 403 message when token is not provided
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};
module.exports = UserController;
