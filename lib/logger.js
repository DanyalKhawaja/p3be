const winston = require("winston")
const path = require("path");
const dateFormat = require("dateformat");
const shelljs = require('shelljs');
const fs = require('fs')
const logDir = path.dirname(__dirname) + '/LOGS/';
const chargingFile = 'SUBSCRIPTION';


// console.log(winston.loggers.get('info'));


module.exports.write = (file, message, type = 'info') => {
    file = file.toUpperCase();
    const filename = logDir + file + "_" + dateFormat(new Date(), "yyyymmdd") + ".log";
    const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.simple()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename })
        ]
    });

    type = type.toUpperCase();
    if (type == 'ERROR') {
        logger.error(message);
    } else {
        logger.info(message);
    }

}


function writeNumberChargFile(expiryDate, number, callback) {
    expiryDate = expiryDate
    removeNumberFromChargFile(number, (response) => {
        if (response == true) {
            let writelog = `echo ` + expiryDate + `^|` + number + '>>' + logDir + chargingFile;
            shelljs.exec(writelog)
            callback(true);
            return true;
        } else {
            callback(false);
            console.log(response);
            return false;
        }
    });
}

function removeNumberFromChargFile(number, callback) {
    const filpath = logDir + chargingFile
    const response = shelljs.grep(number, filpath);
    const result = response.stdout.trim();
    if (result == undefined || result == null || result == '') {
        callback(true);
        return true;
    } else {
        fs.readFile(filpath, 'utf-8', function(err, data) {
            let value = data.replace(result, '');
            value = value.replace(/[\r\n]+/g, '\n');
            fs.writeFile(filpath, value, 'utf-8', function(err) {
                callback(true);
                return true;
            });
        });
    }
}


function checkNumberFromChargFile(number, callback) {
    const filpath = logDir + chargingFile
    const results = shelljs.grep(number, filpath).stdout.trim();
    if (results == undefined || results == null || results == '') {
        console.log('not found user');
        callback(false);
        return false;
    } else {
        let date = results.slice(0, 10);
        let time = results.slice(11, 19);
        expiryDate = dateFormat(new Date(date + " " + time), "yyyy/mm/dd h:MM:ss");
        currentDate = dateFormat(new Date(), "yyyy/mm/dd h:MM:ss");
        if (expiryDate > currentDate) {
            console.log('subscribe user');
            callback(true);
            return true;
        } else {
            console.log('expired user');
            callback(false);
            return false;
        }
    }
}


module.exports.checkNumberFromChargFile = checkNumberFromChargFile;
module.exports.removeNumberFromChargFile = removeNumberFromChargFile;
module.exports.writeNumberChargFile = writeNumberChargFile;
