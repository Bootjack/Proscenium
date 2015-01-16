module.exports = function(grunt) {    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    {src: 'dist/proscenium.js', dest: 'examples/life/proscenium.js'},
                    {src: 'bower_components/modernizr/modernizr.js', dest: 'examples/life/modernizr.js'},
                    {src: 'bower_components/paper/dist/paper-full.js', dest: 'examples/life/paper.js'}
                ]
            }
        },

        jasmine: {
            pivotal: {
                src: 'src/proscenium.js',
                options: {
                    specs: 'spec/*-spec.js',
                    helpers: 'spec/*-helper.js',
                    outfile: 'test-results.html',
                    keepRunner: true,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './',
                            deps: [
                                'bower_components/modernizr/modernizr',
                                'lib/bind-shim'
                            ]
                        }
                    }
                }
            }
        },
        
        jshint: {
            files: [
                'src/**/*.js',
                'lib/phyzix/*.js'
            ]
        },
        
        requirejs: {
            options: {
                baseUrl: './'
            },
            compile: {
                options: {
                    name: 'src/proscenium.js',
                    optimize: 'none',
                    out: 'dist/proscenium.js'
                }
            },
            minify: {
                options: {
                    name: 'src/proscenium.js',
                    optimize: 'uglify',
                    out: 'dist/proscenium.min.js'
                }
            },
            'examples-life': {
                options: {
                    name: 'examples/life/life.js',
                    optimize: 'none',
                    out: 'examples/life/main.js'
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
                tasks: ['jshint', 'jasmine', 'requirejs:compile']
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
    grunt.registerTask('default', ['jshint', 'requirejs', 'stylus']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('build', ['jshint', 'jasmine', 'requirejs', 'copy', 'stylus']);
};
