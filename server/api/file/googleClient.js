var google = require('googleapis');
var config = require("../../config/config");

var jwtClient = new google.auth.JWT(
    config.googleCredentials.email,
    config.googleCredentials.keyFile,
    null,
    config.googleCredentials.scopes,
    null
), drive;

jwtClient.authorize(function(err, tokens) {
    if(err) {
        console.error(err);
        return;
    }
    drive = google.drive({version: 'v3', auth: jwtClient});
});

exports.uploadFile = function() {

};

exports.downloadFile = function() {

}

function requestUpload(file) {

}

function requestDownload(url) {

}
