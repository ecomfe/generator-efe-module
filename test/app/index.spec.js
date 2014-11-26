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
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({'skip-install': true})
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
                '.eslintrc',
                '.gitignore',
                '.npmignore',
                '.travis.yml',
                'package.json',
                'README.md',
                'LICENSE'
            ]);
        });
    });
});
