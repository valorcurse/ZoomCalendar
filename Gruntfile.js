module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
          dist: {
            src: ["./ts/main.ts"], // Put src files in require browserifyOptions because there are multiple files exposed
            dest: 'js/output.js',
            options: {
              watch: true,
              keepAlive: true,
              require: [
                "./ts/day.ts",
                "./ts/globals.ts",
                "./ts/zoomcalendar.ts"
              ],
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
        uglify: {
           build: {
            src: 'js/output.js',
            dest: 'js/output.min.js'
          }
        }
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask("default", ["browserify", "uglify"]);
};