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
					'public/css/home.min.css' : 'assets/sass/layouts/home.scss',
					'public/css/portal.min.css' : 'assets/sass/layouts/portal.scss',
					'public/css/dashboard.min.css' : 'assets/sass/layouts/dashboard.scss',
					'public/css/suggestions.min.css' : 'assets/sass/layouts/suggestions.scss',
					'public/css/account.min.css' : 'assets/sass/layouts/account.scss',
					'public/css/admin.min.css' : 'assets/sass/layouts/admin.scss'
				}
			}
		},
		uglify: {
			options: {
				banner: '/* &copy; 2015 Lindsay Roberts http://www.designbyfish.com/ */\n'
			},
			my_target: {
				files: {
					'public/js/main.min.js' : ['assets/js/main.js'],
					'public/js/chartist.min.js' : ['assets/js/chartist.js'],
					'public/js/home.min.js' : ['assets/js/home.js'],
					'public/js/results.min.js' : ['assets/js/results.js'],
					'public/js/forms.min.js' : ['assets/js/forms.js'],
					'public/js/dashboard.min.js' : ['assets/js/dashboard.js'],
					'public/js/validation/user_registration.min.js' : ['assets/js/validation/user_registration.js'],
					'public/js/validation/billing.min.js' : ['assets/js/validation/billing.js'],
					'public/js/suggestions/pie-chart.min.js' : ['assets/js/suggestions/pie-chart.js'],
					'public/js/suggestions/line-chart.min.js' : ['assets/js/suggestions/line-chart.js'],
					'public/js/dropzone.config.js' : ['assets/js/dropzone/config.js']
				}
			}
		},
		watch: {
			scripts: {
				files: ['assets/js/*.js', 'assets/js/validation/*.js', 'assets/js/suggestions/*.js', 'assets/js/dropzone/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			},
			css: {
	            files: ['assets/sass/*.scss',
	            		'assets/sass/base/*.scss',
	            		'assets/sass/components/*.scss',
	            		'assets/sass/layouts/*.scss',
	            		'assets/sass/mixins/*.scss',
	            		'assets/sass/modules/*.scss'],
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