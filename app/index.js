/**
 * @file main file of app
 * @author nighca<nighca@live.cn>
 */

'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var slugify = require('underscore.string/slugify');

var GitHubApi = require('github');
var github = new GitHubApi({
    version: '3.0.0'
});

/* eslint-disable fecs-camelcase */
var emptyGithubRes = {
    'name': '',
    'email': '',
    'html_url': ''
};
/* eslint-enable fecs-camelcase */

var githubUserInfo = function (name, cb, log) {
    github.user.getFrom({
        user: name
    }, function (err, res) {
        if (err) {
            log.error('Cannot fetch your github profile. Make sure you\'ve typed it correctly.');
            res = emptyGithubRes;
        }
        cb(JSON.parse(JSON.stringify(res)));
    });
};

var EcomfeModuleGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: {
        askForGithubAccount: function () {
            var done = this.async();

            this.log(yosay('Create your own ' + chalk.red('EFE-Style') + ' Node.js module!'));

            var prompt = {
                'name': 'githubUser',
                'message': 'Would you mind telling me your username on GitHub?',
                'default': 'someuser'
            };

            this.prompt([prompt], function (props) {
                this.githubUser = props.githubUser;

                done();
            }.bind(this));
        },

        askForModuleName: function () {
            var done = this.async();
            var moduleName = this.appname;

            var prompt = {
                'name': 'moduleName',
                'message': 'What\'s the name of your module?',
                'default': moduleName
            };

            this.prompt([prompt], function (props) {
                this.moduleName = props.moduleName;
                this.appname = slugify(props.moduleName);

                done();
            }.bind(this));
        }
    },

    configuring: {
        enforceFolderName: function () {
            var paths = this.destinationRoot().split(path.sep);
            if (this.appname !== paths[paths.length - 1]) {
                this.destinationRoot(this.appname);
            }
            this.config.save();
        },

        userInfo: function () {
            var done = this.async();

            githubUserInfo(this.githubUser, function (res) {
                /*jshint camelcase:false */
                this.realname = res.name;
                this.email = res.email;
                this.githubUrl = res.html_url;
                done();
            }.bind(this), this.log);
        }
    },

    writing: {
        app: function () {
            var copy = function (src, target) {
                target = target || src;
                this.fs.copy(
                    this.templatePath(src),
                    this.destinationPath(target)
                );
            }.bind(this);

            copy('index.js', 'index.js');
            copy('bin/bin', 'bin/' + this.appname);
        },

        projectfiles: function () {
            var copy = function (src, target) {
                target = target || src;
                this.fs.copy(
                    this.templatePath(src),
                    this.destinationPath(target)
                );
            }.bind(this);

            var template = function (src, target) {
                target = target || src;
                this.fs.copyTpl(
                    this.templatePath(src),
                    this.destinationPath(target),
                    this
                );
            }.bind(this);

            copy('editorconfig', '.editorconfig');
            copy('fecsrc', '.fecsrc');
            copy('gitignore', '.gitignore');
            copy('npmignore', '.npmignore');
            copy('travis.yml', '.travis.yml');

            copy('LICENSE', 'LICENSE');

            template('_package.json', 'package.json');
            template('README.md');
        }
    }
});

module.exports = EcomfeModuleGenerator;
