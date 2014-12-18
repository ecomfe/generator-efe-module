/**
 * @file main test file
 * @author nighca<nighca@live.cn>
 */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('ecomfe-module:app', function () {
    it('creates files', function () {
        var done = false;

        runs(function () {
            helpers.run(path.join(__dirname, '../../app'))
                .inDir(path.join(os.tmpdir(), './temp-test1'))
                .withPrompt({
                    githubUser: 'nighca',
                    moduleName: 'test-module'
                }).on('end', function () {
                    done = true;
                });
        });

        waitsFor(function() {
            return done;
        });

        runs(function() {
            assert.file([
                '.editorconfig',
                '.fecsrc',
                '.gitignore',
                '.npmignore',
                '.travis.yml',
                'package.json',
                'README.md',
                'LICENSE'
            ]);
        });
    });

    it('creates files in curr dir if module name matches dirname', function () {
        var done = false;

        runs(function () {
            helpers.run(path.join(__dirname, '../../app'))
                .inDir(path.join(os.tmpdir(), './temp-test2'))
                .withPrompt({
                    githubUser: 'nighca',
                    moduleName: 'temp-test2'
                }).on('end', function () {
                    done = true;
                });
        });

        waitsFor(function() {
            return done;
        });

        runs(function() {
            assert.file([
                '.editorconfig',
                '.fecsrc',
                '.gitignore',
                '.npmignore',
                '.travis.yml',
                'package.json',
                'README.md',
                'LICENSE'
            ]);
        });
    });

    it('use empty info with wrong github account', function () {
        var done = false;

        runs(function () {
            helpers.run(path.join(__dirname, '../../app'))
                .inDir(path.join(os.tmpdir(), './temp-test3'))
                .withPrompt({
                    githubUser: 'SOMEBODY_DOES_NOT_EXIST',
                    moduleName: 'test-module'
                }).on('end', function () {
                    done = true;
                });
        });

        waitsFor(function() {
            return done;
        });

        runs(function() {
            assert.file([
                '.editorconfig',
                '.fecsrc',
                '.gitignore',
                '.npmignore',
                '.travis.yml',
                'package.json',
                'README.md',
                'LICENSE'
            ]);

            var packageInfo = require(path.join(os.tmpdir(), './temp-test3', 'test-module/package.json'));
            assert.deepEqual(packageInfo.author, {
                name: '',
                email: '',
                url: ''
            });
        });
    });

});
