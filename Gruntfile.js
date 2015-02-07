module.exports = function(grunt) {    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: 'define([], function () {',
                footer: 'return Proscenium;\n});',
                process: function (src, filepath) {
                    // Strip each define wrapper dep definition at module start
                    src = src.replace(/^define[^{]+{\s*$/mg, '');
                    // Strip define wrapper return statement at module end
                    src = src.replace(/^ {4}return[^}]+?}\);/mg, '');
                    // Strip comments
                    src = src.replace(/\/\/.*$/mg, '');
                    src = src.replace(/\/\*[\w\W]*?\*\//g, '');
                    // Strip empty lines
                    src = src.replace(/\n\s*\n/g, '\n');
                    return src;
                }
            },
            build: {
                files: {
                    'dist/proscenium.js': 'dist/proscenium.amd.js'
                }
            }
        },

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

        jsdoc : {
            dist : {
                src: ['src/*.js'],
                options: {
                    destination: 'doc'
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
                    findNestedDependencies: true,
                    name: 'src/proscenium.js',
                    optimize: 'none',
                    out: 'dist/proscenium.amd.js'
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
                    'examples/life/css/main.css': 'stylus/main.styl'
                }
            }
        },

        uglify: {
            dist: {
                files: {'dist/proscenium.min.js': 'dist/proscenium.js'}
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'requirejs', 'stylus']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('build', ['jshint', 'jasmine', 'requirejs', 'concat', 'uglify', 'copy', 'stylus']);
};
