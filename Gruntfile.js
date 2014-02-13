'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('backchart.jquery.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: ['dist']
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			base: {
				src: ['src/base/model.js', 'src/base/collection.js',  'src/base/view.js'],
				dest: 'dist/bowser/backchart.base.js',
			},
			canvasjs: {
				src: ['src/canvasjs/model.js', 'src/canvasjs/collection.js',  'src/canvasjs/view.js'],
				dest: 'dist/bowser/backchart.canvasjs.js',
			},
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				expand: true,     // Enable dynamic expansion.
				cwd: 'dist/bowser/',      // Src matches are relative to this path.
				src: ['**/*.js'], // Actual pattern(s) to match.
				dest: 'dist/bowser/'   // Destination path prefix.
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			base: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: ['src/base/*.js']
			},
			extend : {
				options: {
					jshintrc: 'src/.jshintrc-ext'
				},
				src: ['src/**/*.js']
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},
		requirejs: {
			base: {
				options: {
					mainConfigFile : "./build/app.js",
					name: "base/main",
					out: "./dist/backchart.base.js",
					exclude : ['jquery','underscore','backbone']
				}
			},
			canvasjs: {
				options: {
					mainConfigFile : "./build/app.js",
					name: "canvasjs/main",
					out: "./dist/backchart.canvasjs.js",
					exclude : ['jquery','underscore','backbone','excanvas','CanvasJS']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Default task.
	grunt.registerTask('default', ['jshint', 'clean', "concat", "uglify", 'requirejs']);

};
