var google = require('googleapis');
var config = require("../../config/config");

var jwtClient = new google.auth.JWT(
    config.gApi.client_email,
    null,
    config.gApi.private_key,
    config.gApi.scopes,
    null
), drive;

jwtClient.authorize(function(err, tokens) {
    if(err) {
        console.error(err);
        return;
    }
    drive = google.drive({version: 'v3', auth: jwtClient});
});

exports.uploadFile = function(file) {
    return new Promise(function(fulfill, reject) {
        requestUpload(file, function(err, fileInfo, message) {
            if(err) {
                reject(err);
            } else {
                fulfill(`https://www.googleapis.com/drive/v3/files/${fileInfo.id}?alt=media`);
            }
        })
    })
};

exports.downloadFile = function(fileUrl) {
    var fileId = fileUrl.match(/files\/(.+)/)[1];

    return new Promise(function(fulfill, reject) {
         fulfill(requestDownload(fileId));
    });
};

function requestUpload(file, cb) {
    drive.files.create({
        resource: {
            name: file.originalname,
            mimeType: file.mimetype
        },
        media: {
            mimeType: file.mimetype,
            body: file.buffer
        }
    }, cb);
}

function requestDownload(fileId) {
    return drive.files.get({fileId: fileId, alt: "media"});
}
