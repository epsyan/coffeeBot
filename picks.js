"use strict";
const fs = require('fs');
const moment = require('moment');

class Picks {

	readList(cb) {
		fs.readFile(`${__dirname}/picks.json`, {encoding: 'utf8'}, (err, list) => {
			if (err) throw err;
			this._list = JSON.parse(list).sort((a, b) => a.lastMakeAt < b.lastMakeAt);
			cb();
		})
	}

	getRandomUser(cb) {
		this.readList(() => {

			const sortedFilteredList = this._list.filter((man, i) => i !== 0); // remove person who make coffee last time
			const intervals = sortedFilteredList.reduce((res, man, i) => [...res, i === 0 ? man.w : man.w + res[i-1]], []);
			const rand = Math.floor(Math.random() * intervals[intervals.length - 1]);
			const chosenIndex = intervals.reduce((res, item, i) => (res === -1 && rand <= item) ? i : res, -1);

			this._chosenOne = sortedFilteredList[chosenIndex];

			cb(this._list[0], sortedFilteredList[chosenIndex]); // return removed from lottery user
		});
	}

	saveNewStats(cb) {
		if (this.chosenOne) {
			const lastMakeAt = new moment().valueOf();
			this._list = this._list
				.map(man => (man.name === this.chosenOne.name ? Object.assign(man, {w: man.w - 1, lastMakeAt }) : man) );

			fs.writeFile(
				`${__dirname}/picks.json`,
				JSON.stringify(this._list),
				(err) => {
					if (err) throw err;
					this._chosenOne = null;
					cb();
				}
			);
		}
	}

	get chosenOne() {
		return this._chosenOne;
	}

	get list() {
		return this._list;
	}

}

module.exports = new Picks();
