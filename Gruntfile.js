module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	// config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Connect plugin for server and synchronisation between browsers/devices
		connect: {
			server: {
				options: {
					port: 9001,
					hostname: '0.0.0.0',
					base: '',
					keepalive: true
				}
			}
		}
	});
	grunt.registerTask('server', ['connect:server']);
};
