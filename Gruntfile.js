module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
          dist: {
            src: ["./ts/main.ts"], // Put src files in require browserifyOptions because there are multiple files exposed
            dest: 'js/output.js',
            options: {
              require: [
                "./ts/day.ts",
                "./ts/globals.ts",
                "./ts/zoomcalendar.ts"
              ],
              browserifyOptions: {
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
        } 
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask("default", ["browserify"]);
};