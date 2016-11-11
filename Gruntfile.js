module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
    
    grunt.initConfig({
        browserify: {
          dist: {
            src: ["./ts/main.ts"], // Put src files in require browserifyOptions because there are multiple files exposed
            dest: 'js/output.js',
            options: {
              // watch: true,
              // keepAlive: true,
              
              browserifyOptions: {
                debug: true,
                plugin: [
                  [
                    'tsify', {
                      target: 'ES6'
                    }
                  ]
                ],
              }
            }
          }
        },
        babel: {
          options: {
              sourceMap: true,
              presets: ['es2015']
          },
          dist: {
              files: {
                  'js/output.es5.js': 'js/output.js'
              }
          }
        },
        uglify: {
           build: {
            src: 'js/output.es5.js',
            dest: 'js/output.min.js'
          }
        },
        watch: {
          // css: {
          //   files: ['sass/*.scss'],
          //   tasks: ['sass:dev']
          // },
          ts: {
            files: ['ts/**/*.ts'],
            tasks: ['browserify']
          }
        }
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask("default", ["browserify", "babel", "uglify"]);
};