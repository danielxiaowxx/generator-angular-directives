'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var glob = require("glob");
var _ = require('lodash');
var Promise = require('bluebird');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');
var fs = Promise.promisifyAll(require('fs-extra'));

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

    this.on('end', function() {
      if (this.needModal == 'No') {
        common.removeFiles(this, [
          '*modal.html'
        ], scrFolder);
      }
    })
  },

  promptForModalType: function() {
    var done = this.async();

    var prompts = [{
      type    : 'list',
      name    : 'needModal',
      message : 'Need modal effect?',
      choices : ['Yes', 'No'],
      default : 'No',
      required: true
    }];

    this.prompt(prompts, function(props) {

      this.needModal = props.needModal;

      done();
    }.bind(this));
  },

  copyDirective: function() {
    var done = this.async();
    Promise.all([
      fs.copyAsync(this.templatePath('./src'), this.destinationPath(scrFolderPath)),
      fs.copyAsync(this.templatePath('./demo'), this.destinationPath(demoFolderPath)),
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
        toFilePath = toFilePath.replace('_.modal', self.directiveName + '-modal');
        toFilePath = toFilePath.replace('_.', '');
        self.fs.copy(
          filePath,
          toFilePath,
          {
            process: function(contents) {

              contents = contents.toString();

              if (self.needModal == 'Yes') {
                contents = contents.replace(/\/\/ -- modal directive start \/\//g, '');
                contents = contents.replace(/\/\/ modal directive end -- \/\//g, '');

                contents = contents.replace(/<!--modal directive start-->/g, '');
                contents = contents.replace(/<!--modal directive end-->/g, '');
              } else {
                contents = contents.replace(/\/\/ -- modal directive start[\s\S]*?modal directive end -- \/\//g, '');

                contents = contents.replace(/<!--modal directive start-->[\s\S]*?<!--modal directive end-->/g, '');
              }

              return _.template(contents, {})({
                directiveName             : self.directiveName,
                camelDirectiveName        : self.camelDirectiveName,
                firstCapCamelDirectiveName: self.firstCapCamelDirectiveName
              });
            }
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
    ], demoFolder);
  },

  usageTip: function() {
    logger.log('=========================');
    logger.log('Congratulations, directive added successfully!');
    logger.log("Gook Luck!");
    logger.log('=========================');
  }

});
