module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    {src: 'bower_components/paper/dist/paper-full.js', dest: 'public/js/paper.js'}
                ]
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: '.',
                    name: 'src/app.js',
                    optimize: 'none',
                    out: 'public/js/main.js',
                    include: [
                        'bower_components/requirejs/require.js',
                        'bower_components/modernizr/modernizr.js'
                    ]
                }
            }
        },

        stylus: {
            merge: {
                options: {
                    paths: ['stylus', 'bower_components'],
                    linenos: true
                },
                files: {
                    'public/css/main.css': 'stylus/main.styl'
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['requirejs:compile']
            },
            stylesheets: {
                files: ['stylus/**/*.styl'],
                tasks: ['stylus:merge']
            }
        }
    });

    // Load tasks (must be installed via npm first)
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'requirejs', 'stylus']);
};
