const modifyHtml = (html) => {
	return html.replace('head data-n-head=""', 'head');
};

export default {
	mode: 'universal',
	dev: (process.env.NODE_ENV === 'production'),
	server: {
		port: process.env.NODE_ENV === 'production' ? 6000 : 3000, // default: 3000
		host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost', // default: localhost
	},

	env: {
		NODE_ENV: process.env.NODE_ENV === 'production' ? 'production' : 'development',
		BASE_URL: process.env.NODE_ENV === 'production' ? 'https://gallerist.collectorshub.art' : 'http://localhost:3000',
	},

	hooks: {
		'generate:page': (page) => {
			page.html = modifyHtml(page.html)
		},
		'render:route': (url, page, {req, res}) => {
			page.html = modifyHtml(page.html)
		}
	},

	/*
	** Headers of the page
	*/
	head: {
		title: 'Gallerist - Collectors Hub',
		meta: [
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			// {name: 'msapplication-TileColor', content: '#da532c'},
			// {name: 'theme-color', content: '#ffffff'},
			{ hid: 'title', name: 'title', content: `Gallerist - Collectors Hub` },
			{ hid: 'description', name: 'description', content: 'Gallerist helps collectors to organize and showcase art in a single place thats been collected across different NFT platforms.' },
			{ hid: 'og:type', property: 'og:type', content: 'website' },

			{ hid: 'og:url', property: 'og:type', content: 'https://gallerist.collectorshub.art/' },
			{ hid: 'og:title', property: 'og:title', content: 'Gallerist - Collectors Hub' },
			{ hid: 'og:description', property: 'og:description', content: 'Gallerist helps collectors to organize and showcase art in a single place thats been collected across different NFT platforms.' },
			{ hid: 'og:image', property: 'og:image', content: 'https://collectorshub.art/gallerist/square.jpg' },

			{ hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
			{ hid: 'twitter:url', property: 'twitter:url', content: 'https://gallerist.collectorshub.art/' },
			{ hid: 'twitter:title', property: 'twitter:title', content: 'Gallerist - Collectors Hub' },
			{ hid: 'twitter:description', property: 'twitter:description', content: 'Gallerist helps collectors to organize and showcase art in a single place thats been collected across different NFT platforms.' },
			{ hid: 'twitter:image', property: 'twitter:image', content: 'https://collectorshub.art/gallerist/square.jpg' },
			{hid: 'description', name: 'description', content: process.env.npm_package_description || ''},
		],
		link: [
			{rel: 'apple-touch-icon', sizes: '120x120', href: '/favicon/apple-touch-icon.png'},
			{rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png'},
			{rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png'},
			{rel: 'manifest', href: '/favicon/site.webmanifest'},
			{rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#5bbad5'},
		],
		bodyAttrs: {
			class: 'theme-cyan font-montserrat'
		},
		script: [
			// { src: 'assets/bundles/libscripts.bundle.js', body: true },
			// { src: 'assets/bundles/vendorscripts.bundle.js', body: true },
			// { src: 'assets/vendor/toastr/toastr.js', body: true },
			// { src: 'assets/bundles/c3.bundle.js', body: true },
			// { src: 'assets/bundles/mainscripts.bundle.js', body: true },
			// { src: 'assets/js/index.js', body: true },
		],
	},
	/*
	** Customize the progress-bar color
	*/
	loading: {color: '#04ABF3'},
	router: {
		linkActiveClass: 'active',
		linkExactActiveClass: 'exact-active',
		middleware: ['HideNavigation']
	},
	/*
	** Global CSS
	*/
	css: [
		'./assets/vendor/bootstrap/css/bootstrap.min.css',
		'./assets/vendor/font-awesome/css/font-awesome.min.css',
		'./assets/vendor/animate-css/vivify.min.css',
		'./assets/vendor/c3/c3.min.css',
		'./assets/vendor/toastr/toastr.min.css',
		'./assets/css/site.min.css',
		'./assets/qwellcode/css/qwellcode.css',
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		{ src: '~/plugins/datatable.js', ssr: false },
		{ src: '~/plugins/login.js', ssr: false },
		{ src: '~/plugins/vue-masonry.js', ssr: false },
		{ src: '~/plugins/vuejs-dialog.js', ssr: false },
		{ src: '~/plugins/inventory-loader.js', ssr: false },
		{ src: '~/plugins/v-photoswipe.js', ssr: false },
		{ src: '~/plugins/image-dimensions.js', ssr: true },
	],
	/*
	** Nuxt.js dev-modules
	*/
	buildModules: [
		'@nuxtjs/style-resources',
	],
	styleResources: {
		// your settings here
		sass: [],
		scss: [],
		less: [],
		stylus: []
	},
	/*
	** Nuxt.js modules
	*/
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/dotenv',
		'@nuxtjs/svg',
		'@nuxtjs/toast',
		'vue-social-sharing/nuxt',
	],
	/*
	** Axios module configuration
	** See https://axios.nuxtjs.org/options
	*/
	axios: {
		baseURL: process.env.NODE_ENV === 'production' ? 'https://api.collectorshub.art' : 'http://localhost:1337',
	},
	/*
	** Build configuration
	*/
	build: {
		optimization: {
			minimize: false
		},
		babel: {
			presets({ isServer }) {
				return [
					[
						require.resolve('@nuxt/babel-preset-app'),
						// require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
						{
							buildTarget: isServer ? 'server' : 'client',
							corejs: { version: 3 }
						}
					]
				]
			}
		},
		extend (config, { isServer }) {
			if (!isServer) {
				config.node = {
					fs: 'empty'
				}
			}

			return config;
		}
	}
}
