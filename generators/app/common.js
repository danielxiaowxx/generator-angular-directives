/**
 * Created by danielxiao on 15/9/28.
 */

var child_process = require('child_process');
var Promise = require('bluebird');
var logger = require('./logger');
var fs = Promise.promisifyAll(require('fs-extra'));
var glob = Promise.promisify(require('glob'));

module.exports = {
  removeFiles: removeFiles,
  exec       : exec
};

function removeFiles(context, rmFiles, folder) {

  var done = context.async();

  var files = rmFiles;
  var remove = [];

  for (var i = 0; i < files.length; i++) {
    remove.push(glob('./' + folder + '/' + files[i]).then(files => {
      return Promise.all(files.map(file => fs.removeAsync(file)));
    }));
  };

  Promise.all(remove)
    .then(function() {
      done();
    })
    .catch(function(err) {
      logger.red(err);
      return;
    });

}

function exec(cmd) {
  return new Promise(function(resolve, reject) {
    child_process.exec(cmd, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
