const DBL = require('dblapi.js');
const mysql = require('../util/mysql.js');
const smarket = require('../util/stockmarket.js');
const tools = require('../util/tools.js')

module.exports = async (client) => {
	try {
		console.log(`Logged ! ${client.user.tag}`);
		tools.updateBotStatus(client);
		mysql.sql.connect((err) => {
			if (err) throw err;
			console.log('Connected!');
		});
		if (process.env.npm_lifecycle_event !== 'dev' && client.options.shards && client.options.shards[0] === 0) {
			const dbl = new DBL(client.config.topggToken, client);
			setInterval(() => {
				mysql.postStats(client);
				smarket.deleteSubscriptions()
					.then(() => console.log("SUBSCRIPTIONS DELETED"))
					.catch((err) => console.log(`SUBSCRIPTIONS COULDN'T BE DELETED : ${err}`))
				tools.getTotalServersOnBot(client).then((size) =>{
					if (size) {
						dbl.postStats(size).then(() => console.log(`STAT POSTED WITH ${size}`)).catch((err) => console.log(`ERROR: STATS NOT POSTED ${err}`));
					}
				})
			}, 3600 * 1000 * 2);
		}
	} catch (e) {
		console.log(e);
	}
};
