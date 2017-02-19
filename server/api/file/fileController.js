var googleClient = require("./googleClient");

exports.uploadFile = function(req, res, next) {
    googleClient.uploadFile(req.file).then(function(fileUrl) {
        res.json({fileUrl: fileUrl});
    })
};

exports.downloadFile = function (req, res, next) {
    if(!req.query.fileUrl) {
        res.status(400).json({message: `File URL has to be provided in query string.`});
    } else {
        googleClient.downloadFile(req.query.fileUrl).then(function(file) {
            file.pipe(res);
        }).catch(next);
    }
};