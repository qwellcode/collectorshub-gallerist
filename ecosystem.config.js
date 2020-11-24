module.exports = {
	apps: [ {
		name: 'COLLECTORS_HUB_GALLERIST_6000',
		script: 'yarn',
		// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
		args: 'start',
		instances: 1,
		autorestart: true,
		watch: false,
		restart_delay: 5000,
		max_memory_restart: '1G',
		env: {
			NODE_ENV: 'production',
		},
	} ],
};
