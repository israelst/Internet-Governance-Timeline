/*globals module: true */
module.exports = function(grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
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
				"pre-commit": "default",
			}
		}
	});

	grunt.loadNpmTasks("grunt-csscomb");
	grunt.registerTask("default", ["csscomb"]);
	grunt.loadNpmTasks("grunt-githooks");

};
