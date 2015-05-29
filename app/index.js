/**
 * @file main file of app
 * @author nighca<nighca@live.cn>
 */

'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GitHubApi = require('github');
var github = new GitHubApi({
    version: '3.0.0'
});

/* eslint-disable fecs-camelcase */
var emptyGithubRes = {
    name: '',
    email: '',
    html_url: ''
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
                this.appname = this._.slugify(props.moduleName);

                done();
            }.bind(this));
        }
    },

    configuring: {
        enforceFolderName: function () {
            if (this.appname !== this._.last(this.destinationRoot().split(path.sep))) {
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
            this.dest.mkdir('bin');
            this.dest.mkdir('lib');
            this.dest.mkdir('test');

            this.src.copy('index.js', 'index.js');
            this.src.copy('bin/bin', 'bin/' + this.appname);
        },

        projectfiles: function () {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('fecsrc', '.fecsrc');
            this.src.copy('gitignore', '.gitignore');
            this.src.copy('npmignore', '.npmignore');
            this.src.copy('travis.yml', '.travis.yml');

            this.src.copy('LICENSE', 'LICENSE');

            this.template('_package.json', 'package.json');
            this.template('README.md');
        }
    }
});

module.exports = EcomfeModuleGenerator;
