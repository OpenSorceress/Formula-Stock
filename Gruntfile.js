module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
				files: {
					'public/css/main.css' : 'assets/sass/main.scss',
					'public/css/dashboard.css' : 'assets/sass/dashboard.scss',
					'public/css/chartist.css' : 'assets/sass/chartist.scss'
				}
			}
		},
		uglify: {
			options: {
				banner: '/* &copy; 2014 Lindsay Roberts http://www.designbyfish.com/ */\n'
			},
			my_target: {
				files: {
					'public/js/main.min.js' : ['assets/js/main.js'],
					'public/js/chartist.min.js' : ['assets/js/chartist.js'],
					'public/js/home.min.js' : ['assets/js/home.js']
				}
			}
		},
		watch: {
			scripts: {
				files: ['assets/js/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			},
			css: {
	            files: ['assets/sass/*.scss'],
	            tasks: ['sass'],
	            options: {
	                spawn: false
	            }
	        }
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['sass', 'uglify', 'watch']);
};