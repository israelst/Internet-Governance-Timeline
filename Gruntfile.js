/*globals module: true */
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		browserify: {
			files: {
				src: [
					'app/js/**/*.js',
					'!app/js/build.js',
				],
				dest: 'app/js/build.js',
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: [
				'Gruntfile.js',
				'app/js/**/*.js',

				'!app/js/build.js'
			]
		},

		csscomb: {
			dynamic_mappings: {
				expand: true,
				src: ['app/style/**/*.css'],
				dest: ''
			}
		},

		githooks: {
			all: {
				'pre-commit': 'default',
			}
		}
	});

	grunt.loadNpmTasks('grunt-githooks');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'csscomb']);

};
