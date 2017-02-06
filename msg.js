module.exports = (key, params) => {
	switch (key) {
		case 'NoOneChosen':
			return 'No one is chosen as coffee maker at the moment. Type "roll" command to me to make a choise.';

		case 'help':
			return '*roll* - choose someone who will make coffee. \n' +
					'*ok* - agree with lottery and save stats. Chosen one can\'t save stats. \n' +
					'*stats* - show stats in format like: _name_ | _coffeeMakeCounter_ | _lastMakeAt_ .';

		case 'timeForCoffee':
			return `Time for coffee! <${params[0]} you are the chosen one. \n ${params[1]} (_${params[2]} was excluded from lottery cos he made coffee last time_)`;

		case 'chosenOneCantSave':
			return 'Chosen one can\'t save stats. Let someone else type "ok" command to me.';

		case 'dontUnderstand':
			return 'Don\'t understand. Stop swearing at me.';

		default: return 'Don\'t understand. Stop swearing at me.'
	}
};
