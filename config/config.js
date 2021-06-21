module.exports = {
    apiUrl: "",
    timeout : 5000,
    portHttp : 8881,
    portHttps : 443,
    httpSecure : false,
    email: {
        service:'gmail',
        host: "smtp.live.com",
        senderName: "Test Node API",
        senderEmail: "freedevel0p3r",
        senderPassword: "hnmdlihejoiupxew",
        //fr33d3v3l0p3r
    },
    token: {
        secret: 'fkeym',
        expiresIn:(60000*30)
    },
    // verificationUrl:'http://64.227.24.36:8881/verify/'
    verificationUrl:'localhost:8881/verify/'

}