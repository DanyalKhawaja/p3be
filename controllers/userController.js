const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dateFormat = require("dateformat");

const userModel = require("../models/userModel.js");
const tokenModel = require('../models/tokenModel.js');
const log = require('../lib/logger');


module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      userModel.find(function (err, users) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: users });
      }).sort({$natural:-1})
        .populate('department', 'name')
        .populate('role', ['name', 'code'])
        .populate('lineManager', 'username')
        .populate('companyId', 'name','company');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such User found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: user });
      })
      .populate('department', 'name')
      .populate('role', 'name, code')
      .populate('companyId', 'name','company');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var user = new userModel({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        designation: req.body.designation,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        phoneNo: req.body.phoneNo,
        companyId: req.body.companyId,
        department: req.body.department,
        role: req.body.role,
        lineManager: req.body.lineManager,
        employmentType: req.body.employmentType,
        createdBy: req.body.createdBy,
        joiningDate: req.body.joiningDate,
        status: req.body.status,
        isVerified: true
      });
      user.setPassword(user, (error, isSet) => {
        user.save(function (err, usr) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).send({ success: false, msg: err.message }
            );
          }
          if (usr) {
            const LOGMESSAGE = DATETIME + "| User found";
            log.write("INFO", LOGMESSAGE);
            return res.status(201).json({ success: true, msg: "user created successfully", data: usr });
          }


        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }


  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
  
        user.username = req.body.username ? req.body.username : user.username;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? req.body.password : user.password;

        user.designation = req.body.designation ? req.body.designation : user.designation;
        user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
        user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
        user.middleName = req.body.middleName ? req.body.middleName : user.middleName;
        user.phoneNo = req.body.phoneNo ? req.body.phoneNo : user.phoneNo;
        user.companyId = req.body.companyId ? req.body.companyId : user.companyId;
        user.department = req.body.department ? req.body.department : user.department;
        user.role = req.body.role ? req.body.role : user.role;
        user.lineManager = req.body.lineManager ? req.body.lineManager : user.lineManager;
        user.employmentType = req.body.employmentType ? req.body.employmentType : user.employmentType;
        user.createdBy = req.body.createdBy ? req.body.createdBy : user.createdBy;
        user.updatedBy = req.body.updatedBy ? req.body.updatedBy : user.updatedBy;
        user.updatedDate = DATETIME;
        user.joiningDate = req.body.joiningDate ? req.body.joiningDate : user.joiningDate;
        user.status = req.body.status ? req.body.status : user.status;
        user.isVerified = req.body.isVerified ? req.body.isVerified : user.isVerified;
        console.log(req.body)
        if (req.body.password) {
          user.setPassword(user, (error, isSet) => {
            if (error) {
              const LOGMESSAGE = DATETIME + "|" + error.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).send({ success: false, msg: error.message }
              );
            }
            user.save(function (err, user) {
              if (err) {
                const LOGMESSAGE = DATETIME + "|" + err.message;
                log.write("ERROR", LOGMESSAGE);
                return res.status(500).json({
                  success: false,
                  msg: "Error when updating user.",
                  error: err
                });
              }
              const LOGMESSAGE = DATETIME + "| User updated";
              log.write("INFO", LOGMESSAGE);
              return res.status(200).json({ success: true, msg: "user updated successfully", data: user });
            });

          });
        } else {
          user.save(function (err, user) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating user.",
                error: err
              });
            }
            const LOGMESSAGE = DATETIME + "| User updated";
            log.write("INFO", LOGMESSAGE);
            return res.status(200).json({ success: true, msg: "user updated successfully", data: user });
          });
        }


      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findByIdAndRemove(id, function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|User not found to delete|" + user;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "User not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "| User removed";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({
          success: true,
          msg: "user is deleted succussfully"
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showUsername: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "username", function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showFirstName: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "firstName", function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showLastName: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "lastName", function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showEmail: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "email", function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showPhoneNumber: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "phoneNo", function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showFullName: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, ["firstName", "middleName", "lastName"], function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showRole: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "role").populate("role").exec(function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  },
  showDepartment: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.findOne({ _id: id }, "department").populate("department").exec(function (err, user) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting user.",
            error: err
          });
        }
        if (!user) {
          const LOGMESSAGE = DATETIME + "|No such user";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such user"
          });
        }
        const LOGMESSAGE = DATETIME + "| User found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: user });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting user.",
        error: error
      });
    }

  }
};
