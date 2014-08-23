/*globals module: true */
module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			src: [
				"Gruntfile.js",
				"app/js/**/*.js",

				"!app/js/lib/**/*.js" // Not Hinting on a 3rd party lib
			]
		},

		csscomb: {
			dynamic_mappings: {
				expand: true,
				src: ['app/style/**/*.css'],
				dest: ''
			}
		},

		// Don't need to call this, it's hooked to `npm install`
		githooks: {
			all: {
				"pre-commit": "csscomb",
			}
		}
	});

	grunt.loadNpmTasks("grunt-githooks");
	grunt.loadNpmTasks("grunt-csscomb");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	grunt.registerTask("default", ["jshint", "csscomb"]);

};
