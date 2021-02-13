const dateFormat = require("dateformat");
//const dayjs = require("dayjs");

// const dayJS = require('dayjs');

// const createMonthlyArray = (firstDate) => {
//     let from = dayjs(firstDate);
//     let to = dayjs().add(1, 'month');
//     let array = [];
//     do {
//         array.push({
//             _id: from.format('YYYY-MM'),
//             plannedCost: 0,
//             plannedCompletion: 0,
//             actualCompletion: 0,
//             actualCost: 0,
//             cumulativePlannedCost: 0,
//             cumulativePlannedCompletion: 0,
//             cumulativeActualCompletion: 0,
//             cumulativeActualCost: 0,
//             cumulativePlannedValue: 0,
//             cumulativeEarnedValue: 0
//         });
//         from = from.add(1, 'month');
//     } while (!from.isAfter(to, 'month'));
//     return array;
// };


const getFirstDate = date => {
    return new Date(date.getFullYear(), date.getMonth());
}

const getMonthID = date => {
    return (['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'][date.getMonth()] + date.getFullYear());
}

const businessDays = (startDate, endDate) => {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
            count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}
const alpha = () => 0.5;
const beta = () => 0.3;
const At = (D, t, A, T) => {
    if (A.length > t) return A[t];
    else {
        A[t] = (alpha() * D[t]) + ((1 - alpha()) * (A[t - 1] + T[t - 1]));
        return A[t];
    }
};

const Tt = (D, t, A, T) => {
    if (T.length > t) return T[t];
    else {
        T[t] = ((beta() * (At(D, t, A, T) - A[t - 1])) + ((1 - beta()) * T[t - 1]));
        return T[t];
    }

};

getFt = (t, D, A, T) => At(D, t - 1, A, T) + Tt(D, t - 1, A, T);


const cycleDays = (frequency, startDate) => ({
    1: 1,
    2: 5,
    3: 15,
    4: businessDays(new Date(startDate), monthEndDate(new Date()))
}[frequency]);

const nextCycle = (frequency, startDate, endDate) => {
    let _cycleDays = cycleDays(frequency, new Date(startDate));
    let offDays = 0, count = 0, today = new Date();
    let correctDate;
    var curDate = startDate;
    var curWeekDay = startDate.getDay();

    while (curDate < today) {
        var dayOfWeek = curDate.getDay();
        if (!((dayOfWeek == 6) || (dayOfWeek == 0))) count++;
        else offDays++;
        curDate.setDate(curDate.getDate() + 1);
    }
    let daysLapse = count % _cycleDays;
    let lastDays = daysLapse;
    let dueDates = [];
    while (true) {
        var dayOfWeek = curDate.getDay();
        if (daysLapse < _cycleDays) {
            if (!((dayOfWeek == 6) || (dayOfWeek == 0))) daysLapse++;
        } else {
            let nextDate = _cycleDays == 1 ? new Date() : new Date(curDate.setDate(curDate.getDate() - 1));
            dueDates.push({ date: nextDate, days: daysLapse });
            daysLapse = 0;
        }
        if (dueDates.length == 1) return dueDates;
        curDate.setDate(curDate.getDate() + 1);
    }
}

function respondWithError(res, err, msg) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    const LOGMESSAGE = DATETIME + "|" + err.message;
    log.write("ERROR", LOGMESSAGE);
    return res.status(500).json({
        success: false,
        msg: msg,
        error: err,
    });
}


function respondWithNotFound(res, msg) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    const LOGMESSAGE = DATETIME + "|" + err.message;
    log.write("ERROR", LOGMESSAGE);
    return res.status(404).json({
        success: false,
        msg: msg
    });
}

module.exports = { createMonthlyArray, respondWithError, nextCycle, getFirstDate, getFt, businessDays };