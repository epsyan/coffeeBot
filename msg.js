module.exports = {
	NO_ONE_CHOSEN: 'No one is chosen as coffee maker at the moment. Type "roll" command to me to make a choise.',
	HELP: (
		'*roll* - choose someone who will make coffee. \n' +
		'*ok* - agree with lottery and save stats. Chosen one can\'t save stats. \n' +
		'*stats* - show stats in format like: _name_ | _coffeeMakeCounter_ | _lastMakeAt_ . \n' +
		'*rollModel* - show results for a 1000 times random choise. \n' + 
		'*news* - print latest news list. \n' +
		'*vacation %personName%* - set vacation status for person. You should use just name, without @ sign.'
	),
	TIME_FOR_COFFEE: 'Time for coffee! <@%s> you are the chosen one. \n (_%s was excluded from lottery cos he made coffee last time_)',
	CHOSEN_ONE_CANT_SAVE: 'Chosen one can\'t save stats. Let someone else type "ok" command to me.',
	VACATION_DONE: 'Vacation status has been changed.',
	DONT_UNDERSTAND: 'Don\'t understand. Stop swearing at me.'
};
