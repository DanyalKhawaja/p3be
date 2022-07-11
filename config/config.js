module.exports = {
    apiUrl: "",
    timeout : 5000,
    portHttp : 8000,
    portHttps : 443,
    httpSecure : false,
    email: {
        service:'gmail',
        host: "smtp.live.com",
        senderName: "Test Node API",
        senderEmail: "freedevel0p3r",
        senderPassword: "hnmdlihejoiupxew",
    },
    token: {
        secret: 'fkeym',
        expiresIn:(60000*30)
    },
    verificationUrl:'localhost:8000/verify/'

}
