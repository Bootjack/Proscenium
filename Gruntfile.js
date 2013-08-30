module.exports = function(grunt) {    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    {src: 'bower_components/requirejs/require.js', dest: 'public/js/require.js'},
                    {src: 'bower_components/paper/dist/paper-full.js', dest: 'public/js/paper.js'}
                ]
            }
        },

        jasmine: {
            pivotal: {
                src: 'src/**/*.js',
                options: {
                    specs: 'spec/*-spec.js',
                    helpers: 'spec/*-helper.js',
                    outfile: 'test-results.html',
                    keepRunner: true,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './',
                            name: 'src/app.js',
                            include: [
                                'bower_components/modernizr/modernizr.js'
                            ]
                        }
                    }
                }
            }
        },
        
        jshint: {
            files: ['src/**/*.js', 'lib/phyzix/*.js']
        },
        
        requirejs: {
            compile: {
                options: {
                    baseUrl: './',
                    name: 'src/app.js',
                    optimize: 'none',
                    out: 'public/js/main.js',
                    include: [
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
                tasks: ['jshint', 'requirejs:compile']
            },
            stylesheets: {
                files: ['stylus/**/*.styl'],
                tasks: ['stylus:merge']
            }
        }
    });

    // Load tasks (must be installed via npm first)
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'jasmine', 'requirejs', 'stylus']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('build', ['jshint', 'jasmine', 'requirejs', 'copy', 'stylus']);
};
