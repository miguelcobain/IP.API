({
    baseUrl: 'src',
    paths : {
		jquery : '../lib/jquery.min'
	},
    name: '../almond',
    include: ['main'],
    out: 'build/ip.api.debug.js',
    wrap: true,
    optimize: 'none'
})