const WebSocket = require('ws');

const toJSON = (stateData) => {
	return JSON.stringify(stateData || {});
};

const fromJSON = (stateData) => {
	return JSON.parse(stateData || {});
};

const createServer = function (state, configure = {}) {
	let server = new WebSocket.Server(configure);
	let sequenceState = {};

	for (let stateActionId in state) {
		let action = state[stateActionId];
		sequenceState[action.name] = action;
	}

	server.on('connection', (socket) => {
		socket.on('message', async (stateData) => {
			stateData = fromJSON(stateData);
			try {
				let argumentsStateData = stateData.args;
				if (sequenceState.hasOwnProperty(stateData.name)) {
					try {
						let result = await sequenceState[stateData.name](...argumentsStateData, socket);
						socket.send(toJSON({
							id: stateData.id,
							name: stateData.name,
							status: 1,
							result
						}))
					} catch (error) {
						socket.send(toJSON({
							id: stateData.id,
							name: stateData.name,
							status: 2,
							result: error
						}));
					}

					return;
				}

				socket.send(toJSON({
					id: stateData.id,
					name: stateData.name,
					status: 0,
					result: 'Command not found'
				}));
			} catch (errorState) {
				socket.send(toJSON({
					id: -1,
					name: -1,
					status: 2,
					result: 'When working with the package, an error occurred, try again'
				}));
			}
		});
	});

	return server;
};

module.exports.createServer = createServer;
