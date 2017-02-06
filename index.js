"use strict";
const fs = require('fs');
const SlackBot = require('slackbots');
const picks = require('./picks');
const credentials = require('./credentials.json');
const moment = require('moment');
const msg = require('./msg');

const bot = new SlackBot({
    token: credentials.apiKey,
    name: 'My Bot'
});

// setInterval(roll, 5000);

bot.on('start', () => { console.log('started') });

bot.on('message', (message) => {
  if (message.type === 'message' && message.text.includes('<@U3Y9DSLJJ>')) {
    let cmd = message.text.slice(12).replace(/\s/g, '');
    // console.log(cmd);
    // console.log(msg);

    switch (cmd) {
		case 'roll':
			roll(); break;

		case 'ok':
			if (!picks.chosenOne) postMsg(msg('NoOneChosen'));
			agreeWithRoll(message.user);
		break;

		case 'stats':
			printStats(); break;

		case 'rollModel':
			rollStatistically(1000); break;

		case 'help':
			postMsg(msg('help'));
		break;

		default:
		  postMsg(msg('dontUnderstand'))
    }
  }
});

function roll() {
	picks.getRandomUser((lastMaker) => {
		bot
			.getUser(picks.chosenOne.name)
			.then(slackUser => {
				postMsg(msg('timeForCoffee', [slackUser.id, slackUser.presence === 'active' ? '' : `*Seems like ${picks.chosenOne.name} is away* \n`, lastMaker.name]))
			});
	});
}

function rollStatistically(num) {
	const promises = [];
	const users = [];

	while (num) {

		promises.push(new Promise((resolve) => {
			picks.getRandomUser((lastMaker, chosenOne) => {
				users.push(chosenOne);
				resolve(picks.chosenOne.name);
			});
		}));

		num--;
	}

	Promise
		.all(promises)
		.then((users) => {
			const stats = users.reduce((res, u) => {
				res[u] = res[u] ? res[u] + 1 : 1;
				return res;
			}, {});

			const statsStr = Object.keys(stats).reduce((res, key) => res + key + ': ' + stats[key] + '\n', '');
			postMsg(statsStr);
		});

}

function agreeWithRoll(user) {
	bot.getUserById(user).then(slackUser => {
		if (slackUser.name === picks.chosenOne.name) {
			postMsg(msg('chosenOneCantSave'));
		} else {
			picks.saveNewStats(() => postMsg('Stats saved'));
		}
	});
}

function printStats() {
	picks.readList(() => {
		postMsg(
			picks.list.reduce((res, man) => `${res} \n ${man.name} | ${100 - man.w} | ${man.lastMakeAt ? moment(man.lastMakeAt).format('LLL') : 'Never'}`, "")
		);
	});
}

function postMsg(msg) {
/*	return bot.postMessageToChannel(
		'test-channel',
		msg,
		{
			username: 'coffieBot',
			icon_emoji: ':coffee:'
		}
	);*/
	return bot.postMessageToGroup(
		'coffie-chat',
		msg,
		{
			username: 'coffieBot',
			icon_emoji: ':coffee:'
		}
	);
}
