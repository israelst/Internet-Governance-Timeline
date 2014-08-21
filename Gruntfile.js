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
		}
	});

	grunt.loadNpmTasks("grunt-csscomb");
	grunt.registerTask("default", ["csscomb"]);

};
