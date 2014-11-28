module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '*.js',
                dest: 'build/index.min.js'
            }
        },

        requirejs: {
            options: {
                findNestedDependencies: true,
                mainConfigFile: 'index.js',
                // baseUrl: './',
                dir: 'build',
                name: 'index.js',
                out: 'build.js',
                // optimize: 'uglify',
                // uglify:{

                // }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);

};