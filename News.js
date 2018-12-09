const rp = require('request-promise-native');
const cheerio = require('cheerio');

class News {

	parse() {
		const min = 0;
		const max = News.newsSources.length - 1;
		const newsIndex = Math.floor(Math.random() * (max - min + 1)) + min;

		return (
			rp(News.newsSources[newsIndex], { followRedirect: false })
				.then((page) => {
					const $ = cheerio.load(page);
					const links = $('.lenta_holder.active > div > a > strong');

					return (
						links.slice(0,5)
							.map((i, link) => ({
								link: link.parent.attribs.href.includes('http') ? link.parent.attribs.href : `http://nv.ua${link.parent.attribs.href}`,
								text: link.children[0].data
							}))
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