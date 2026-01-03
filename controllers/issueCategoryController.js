const dateFormat = require("dateformat");

const issueCategoryModel = require("../models/issueCategoryModel");
const issueInitiationLogModel = require("../models/issueInitiationLogModel");
const log = require('../lib/logger');

module.exports = {
    list: function (req, res) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        try {
            issueCategoryModel.find(function (err, issueCategory) {
                if (err) {
                    const LOGMESSAGE = DATETIME + "|" + err.message;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(500).json({
                        success: false,
                        msg: "Error when getting issueCategory.",
                        error: err
                    });
                }
                const LOGMESSAGE = DATETIME + "|issue Category List found";
                log.write("INFO", LOGMESSAGE);
                return res.json({success: true, data: issueCategory});
            }).sort({$natural: -1});
        } catch (error) {
            const LOGMESSAGE = DATETIME + "|" + error.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
                success: false,
                msg: "Error when getting issueCategory.",
                error: error
            });
        }

    },
    listByProject: function (req, res) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var id = req.params.id;
        try {
            issueInitiationLogModel.find({project: id}, function (err, issueInitiationLog) {
                if (err) {
                    const LOGMESSAGE = DATETIME + "|" + err.message;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(500).json({
                        success: false,
                        msg: "Error when getting issueType.",
                        error: err
                    });
                }

                if (issueInitiationLog) {
                    var issueInitiationLogArr = [];
                    issueInitiationLog.forEach(
                        function (row) {
                            issueInitiationLogArr.push(row.category);
                        });
                    console.log(issueInitiationLogArr)
                    issueCategoryModel.find({_id: issueInitiationLogArr}, function (err, issueCategory) {
                        if (err) {
                            const LOGMESSAGE = DATETIME + "|" + err.message;
                            log.write("ERROR", LOGMESSAGE);
                            return res.status(500).json({
                                success: false,
                                msg: "Error when getting issueCategory.",
                                error: err
                            });
                        }
                        if (issueCategory) {
                            const LOGMESSAGE = DATETIME + "|issue ategory List found";
                            log.write("INFO", LOGMESSAGE);
                            return res.json({success: true, data: issueCategory});
                        }

                    });

                }

            });

        } catch (error) {
            const LOGMESSAGE = DATETIME + "|" + error.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
                success: false,
                msg: "Error when getting issueCategory.",
                error: error
            });
        }

    },
    create: function (req, res) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        try {
            var issueCategory = new issueCategoryModel({
                description: req.body.description
            });

            issueCategory.save(function (err, issueCategory) {
                if (err) {
                    const LOGMESSAGE = DATETIME + "|" + err.message;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(500).json({
                        success: false,
                        msg: "Error when creating issue Category",
                        error: err
                    });
                }
                const LOGMESSAGE = DATETIME + "|issue Category created";
                log.write("INFO", LOGMESSAGE);
                // return res.status(201).json(issue Category);
                return res.json({success: true, msg: "issue Category is created", data: issueCategory});
            });
        } catch (error) {
            const LOGMESSAGE = DATETIME + "|" + error.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
                success: false,
                msg: "Error when getting issueCategory.",
                error: error
            });
        }

    },

    update: function (req, res) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var id = req.params.id;
        try {
            issueCategoryModel.findOne({_id: id}, function (err, issueCategory) {
                if (err) {
                    const LOGMESSAGE = DATETIME + "|" + err.message;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(500).json({
                        success: false,
                        msg: "Error when getting issue Category",
                        error: err
                    });
                }
                if (!issueCategory) {
                    const LOGMESSAGE = DATETIME + "|No such issue Category to update";
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(404).json({
                        success: false,
                        msg: "No such issue Category"
                    });
                }


                issueCategory.description = req.body.description ? req.body.description : issueCategory.description;


                issueCategory.save(function (err, _issueCategory) {
                    if (err) {
                        const LOGMESSAGE = DATETIME + "|" + err.message;
                        log.write("ERROR", LOGMESSAGE);
                        return res.status(500).json({
                            success: false,
                            msg: "Error when updating issue Category.",
                            error: err
                        });
                    }
                    const LOGMESSAGE = DATETIME + "|Saved issue Category";
                    log.write("INFO", LOGMESSAGE);
                    return res.json({success: true, msg: "issue Category is updated", data: _issueCategory});
                });
            });
        } catch (error) {
            const LOGMESSAGE = DATETIME + "|" + error.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
                success: false,
                msg: "Error when getting issueCategory.",
                error: error
            });
        }
    },

    remove: function (req, res) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var id = req.params.id;
        try {
            issueCategoryModel.findByIdAndRemove(id, function (err, issueCategory) {
                if (err) {
                    const LOGMESSAGE = DATETIME + "|" + err.message;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(500).json({
                        success: false,
                        msg: "Error when deleting the issue Category.",
                        error: err
                    });
                }
                if (!issueCategory) {
                    const LOGMESSAGE = DATETIME + "|issueCategory not found to delete|" + issueCategory;
                    log.write("ERROR", LOGMESSAGE);
                    return res.status(404).json({
                        success: false,
                        msg: "Id not found to delete"
                    });
                }
                const LOGMESSAGE = DATETIME + "|removed issue Category:" + id;
                log.write("INFO", LOGMESSAGE);
                return res.json({success: true, msg: "issue Category is deleted"});
                // return res.status(204).json();
            });
        } catch (error) {
            const LOGMESSAGE = DATETIME + "|" + error.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
                success: false,
                msg: "Error when getting issueCategory.",
                error: error
            });
        }

    }
};
