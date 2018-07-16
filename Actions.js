const picks = require('./Picks');
const moment = require('moment');
const rightPad = require('right-pad');
const sprintf = require('sprintf-js').sprintf;
const MSG = require('./msg');
const News = require('./News');

const news = new News();

module.exports = class Actions {
	constructor(bot) {
		this.bot = bot;
	}

	resolveAction(message) {
		if (message.type === 'message' && message.text && message.text.includes('<@U3Y9DSLJJ>')) {
			const cmd = message.text.slice(13).match(/^(\w+)\s?/);

			if (!cmd || !cmd[1]) return this.postMsg(MSG.DONT_UNDERSTAND);

			switch (cmd[1]) {
				case 'roll':
					return this.roll();

				case 'ok':
					if (!picks.chosenOne) {
						this.postMsg(MSG.NO_ONE_CHOSEN);
					}

					return this.agreeWithRoll(message.user);

				case 'stats':
					return this.printStats();

				case 'rollModel':
					return this.rollStatistically(1000);

				case 'news':
					return this.printNews();

				case 'vacation':
					return this.changeVacationStatus(message);

				case 'help':
					return this.postMsg(MSG.HELP);

				default:
					return this.postMsg(MSG.DONT_UNDERSTAND);
			}
		}
	}

	roll() {
		picks
			.getRandomUser((lastMaker) => {
				this.bot
					.getUser(picks.chosenOne.name)
					.then((slackUser) => {
						this.postMsg(sprintf(MSG.TIME_FOR_COFFEE, slackUser.id, lastMaker.name));
					});
			});
	}

	rollStatistically(num) {
		const promises = [];

		while (num--) {
			promises.push(new Promise((resolve) => {
				picks.getRandomUser(() => {
					resolve(picks.chosenOne.name);
				});
			}));
		}

		Promise
			.all(promises)
			.then((users) => {
				const statsStr = (
					Array
						.from(new Set(users))
						.map(u => `${u}: ${users.filter((user) => user === u).length}`)
						.join('\n')
				);

				this.postMsg(statsStr);
				picks.resetChosenOne();
			});
	}

	agreeWithRoll(user) {
		this.bot
			.getUserById(user)
			.then((slackUser) => {
				if (slackUser.name === picks.chosenOne.name) return this.postMsg(MSG.CHOSEN_ONE_CANT_SAVE);

				picks
					.saveNewStats(() => {
						this.postMsg('Stats saved');
						this.printStats();
						this.printNews('While the coffee is preparing, get ready to discuss these news:');
					});
			});
	}

	printNews(heading = '') {
		news.parse()
			.then((newsString) => this.postMsg(heading + newsString));
	}

	changeVacationStatus(message) {
		const usernameMatch = message.text.slice(13).match(/^(\w+)\s([\w._]+)/);
		const username = usernameMatch && usernameMatch[2];
		const afterVacation = () => this.postMsg(MSG.VACATION_DONE);

		picks.changeVacation(username, afterVacation);
	}

	printStats() {
		picks.readList(() => {
			const message = (
				picks.list
					.map((man) => {
						const name = rightPad(man.name, 16, ' ');
						const weight = 200 - man.w;
						const lastMakeAt = man.lastMakeAt ? moment(man.lastMakeAt).format('LLL') : 'Never';
						const onVacation = man.isPaused ? ' | on vacation' : '';

						return [name, weight, lastMakeAt].join(' | ') + onVacation;
					})
					.join('\n')
			);

			this.postMsg(`\`\`\`${message}\`\`\``, 'full');
		});
	}

	postMsg(msg, parse = 'none') {
		// const channelName = 'test-channel';
		const channelName = 'coffie-chat';
		const config = [
			channelName,
			msg,
			{
				username: 'coffieBot',
				icon_emoji: ':coffee:',
				parse
			}
		];

		return this.bot.postTo(...config);
	}
};
