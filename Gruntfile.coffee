module.exports = (grunt) ->

  # Used instead of "ext" to accommodate filenames with dots. Lots of talk all
  # over GitHub, including here: https://github.com/gruntjs/grunt/pull/750
  coffeeRename = (dest, src) -> "#{ dest }#{ src.replace /\.(lit)?coffee$/, '.js' }"

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files: [
          expand: true
          cwd: './src/'
          src: ['*.?(lit)coffee']
          dest: './'
          rename: coffeeRename
        ]
    watch:
      options:
        atBegin: true
      coffee:
        files: ['src/*.?(lit)coffee']
        tasks: ['build']
    bump:
      options:
        files: ['package.json', 'bower.json']
        commit: true
        commitFiles: ['-a']
        createTag: true
        push: false

  # Load grunt plugins
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-bump'

  # Define tasks.
  grunt.registerTask 'build', ['coffee:compile']
  grunt.registerTask 'default', ['build']
