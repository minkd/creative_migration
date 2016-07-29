/**
 Copyright 2016 Valassis Interactive, Inc.
 All Rights Reserved.
 NOTICE: All information contained herein is, and remains the property of
 Valassis Interactive, Inc. The intellectual and technical concepts
 contained herein are proprietary to Valassis Interactive, Inc. and
 may be covered by U.S. and Foreign Patents, pending patents, and may be
 protected by trade secret law. Dissemination of this information or
 reproduction of this material is strictly forbidden unless prior written
 permission is obtained from Valassis Interactive, Inc.
 */
"use strict";

var request = require('superagent');
var util = require('util');

// staging http://filevault.staging.plumlabs.us
var server = process.env.FILEVAULT_SERVER
var url = 'http://' + server;

if (process.env.FILEVAULT_PORT){
  url = url + ':' + process.env.FILEVAULT_PORT;
}

exports.save = function (max_attempts, filePath, callback) {

  request
    .post(util.format('%s%s', url, "/document" ))
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .attach('file', filePath)
    .end(function (error, result) {
      if (error){
        console.log("File Vault error on: " + filePath)
        if (max_attempts > 0) {
          setTimeout(function () {
            console.log("Retrying " + filePath + ", " + max_attempts + " remaining");
            exports.save(max_attempts - 1, filePath, callback);
          }, Math.random() * 6000);
        } else {
          console.log(error);
          process.exit(1);
        }
      } else {
        callback(null, result);
      }
    });

};