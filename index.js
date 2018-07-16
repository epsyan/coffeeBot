const SlackBot = require('slackbots');
const credentials = require('./credentials.json');
const Actions = require('./Actions');

const bot = new SlackBot(credentials.slackBot);
const actions = new Actions(bot);

bot.on('start', () => { process.stdout.write('started'); });
bot.on('message', (message) => actions.resolveAction(message));
