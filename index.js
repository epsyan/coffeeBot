const fs = require('fs');
const SlackBot = require('slackbots');
const picks = require('./picks');
const credentials = require('./credentials.json');
const moment = require('moment');

const bot = new SlackBot({
    token: credentials.apiKey,
    name: 'My Bot'
});

const params = {
  username: 'coffieBot',
  icon_emoji: ':coffee:'
};

// setInterval(roll, 5000);

bot.on('start', () => { console.log('started') });

bot.on('message', (msg) => {
  if (msg.type === 'message' && msg.text.includes('<@U3Y9DSLJJ>')) {
    let cmd = msg.text.slice(12).replace(/\s/g, '');
    // console.log(cmd);
    // console.log(msg);

    switch (cmd) {
		case 'roll':
			roll(); break;

		case 'ok':
			if (!picks.chosenOne) postMsg('No one is chosen as coffee maker at the moment. Type "roll" command to me to make a choise.');
			agreeWithRoll(msg.user);
		break;

		case 'stats':
			printStats(); break;

		case 'help':
postMsg(`
*roll* - choose someone who will make coffee.
*ok* - agree with lottery and save stats. Chosen one can't save stats.
*stats* - show stats in format like: _name_ | _coffeeMakeCounter_ | _lastMakeAt_ .
`);
		break;

		default:
		  postMsg('Don\'t understand. Stop swearing at me.')
    }
  }
});

function roll() {
	picks.getRandomUser((lastMaker) => {
		bot
			.getUser(picks.chosenOne.name)
			.then(slackUser => {
				postMsg(`Time for coffee! <@${slackUser.id}> you are the chosen one. \n ${slackUser.presence === 'active' ? '' : `*Seems like ${picks.chosenOne.name} is away* \n`}(_${lastMaker.name} was excluded from lottery cos he made coffee last time_)`)
			});
	});
}

function agreeWithRoll(user) {
	bot.getUserById(user).then(slackUser => {
		if (slackUser.name === picks.chosenOne.name) {
			postMsg('Chosen one can\'t save stats. Let someone else type "ok" command to me. ');
		} else {
			picks.saveNewStats(() => postMsg('Stats saved.'));
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
  return bot.postMessageToChannel('test-channel', msg, params);
}
