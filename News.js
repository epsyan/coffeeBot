const rp = require('request-promise-native');
const cheerio = require('cheerio');

class News {

	parse() {
		const min = 0;
		const max = News.newsSources.length - 1;
		const newsIndex = Math.floor(Math.random() * (max - min + 1)) + min;

		return (
			rp(News.newsSources[newsIndex])
				.then((page) => {
					const $ = cheerio.load(page);
					const containers = $('.flex-wrap .atom__text__main');

					return (
						containers
							.slice(0, 5)
							.map((i, container) => {
								return {
									text: ($(container).find('.red').text() + $(container).find('a').text()).replace(/\s{2,}/g, ' ').trim(),
									link: $(container).find('a').attr('href')
								};
							})
							.get()
							.reduce((res, link) => `${res} \n <${link.link}|${link.text}>`, '')
					);
				})
		);
	}
}

News.newsSources = [
	'http://nv.ua',
	'http://nv.ua/ukr.html'
];

module.exports = News;