({
    baseUrl: 'src',
    paths : {
		jquery : '../lib/jquery.min',
		iexhr : '../lib/ie.xhr'
	},
    name: '../almond',
    include: ['main'],
    insertRequire: ['main'],
    out: 'build/ip.api.min.js',
    wrap: true,
})