({
    baseUrl: 'src',
    paths : {
		jquery : '../lib/jquery.min'
	},
    name: '../almond',
    include: ['main'],
    out: 'build/ip.api.min.js',
    wrap: true,
})