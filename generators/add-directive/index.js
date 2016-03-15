'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var glob = require("glob");
var _ = require('lodash');
var Promise = require('bluebird');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

var scrFolderPath, scrFolder, demoFolderPath, demoFolder;

module.exports = yeoman.generators.Base.extend({

  init: function() {
    this.argument('name', {
      required: true,
      type    : String,
      desc    : 'The directive name'
    });

    this.log('You called the angular-directives add-directive with the argument ' + this.name + '.');

    // example: name = demo-user
    this.directiveName = s(this.name).slugify().value(); // => demo-user
    this.camelDirectiveName = s(this.directiveName).camelize().value(); // => demoUser
    this.firstCapCamelDirectiveName = s(this.camelDirectiveName).capitalize().value(); // => DemoUser

    scrFolder = 'src/' + this.directiveName;
    scrFolderPath = './' + scrFolder + '/';
    demoFolder = 'demo/' + this.directiveName;
    demoFolderPath = './' + demoFolder + '/';
  },

  copyDirective: function() {
    var done = this.async();
    Promise.all([
      common.exec('cp -rf ' + this.templatePath('./src') + ' ' + this.destinationPath(scrFolderPath)),
      common.exec('cp -rf ' + this.templatePath('./demo') + ' ' + this.destinationPath(demoFolderPath))
    ]).then(function() {
      done();
    })
  },

  copyTemplates: function() {
    var self = this;
    var done = this.async();

    glob('{' + scrFolderPath + ',' + demoFolderPath + '}' + "*.*", {}, function(er, files) {
      _.each(files, function(filePath) {
        var toFilePath = filePath.replace('_.name', self.directiveName);
        toFilePath = toFilePath.replace('_.', '');
        self.fs.copyTpl(
          filePath,
          toFilePath,
          {
            directiveName             : self.directiveName,
            camelDirectiveName        : self.camelDirectiveName,
            firstCapCamelDirectiveName: self.firstCapCamelDirectiveName
          });
      });

      done();
    });
  },

  removeFiles: function() {
    common.removeFiles(this, [
      '_.*.*'
    ], scrFolder);

    common.removeFiles(this, [
      '*.*'
    ], demoFolder)
  },

  usageTip: function() {
    logger.log('=========================');
    logger.log('Congratulations, directive added successfully!');
    logger.log("Gook Luck!");
    logger.log('=========================');
  }

});