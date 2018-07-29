const eventBus = require('byteballcore/event_bus');

function subscribe(name, socket) {
	name = name.toLowerCase();
	switch (name) {
		case 'text':
			eventBus.on('text', function cb_text(from_address, text) {
				if (socket.readyState === 3) {
					eventBus.removeListener('text', cb_text);
					return;
				}
				let json;
				try {
					json = JSON.parse(text);
					if (json.id || json.app) json = null;
				} catch (e) {
				}
				if (!json) {
					socket.send(JSON.stringify({
						id: -2,
						name: 'text',
						status: 1,
						result: {from_address, text}
					}));
				}
			});
			break;
		case 'paired':
			eventBus.on('paired', function cb_paired(from_address, pairing_secret) {
				if (socket.readyState === 3) {
					eventBus.removeListener('paired', cb_paired);
					return;
				}
				socket.send(JSON.stringify({
					id: -2,
					name: 'paired',
					status: 1,
					result: {from_address, pairing_secret}
				}));
			});
			break;

		case 'new_my_transactions':
			eventBus.on('new_my_transactions', function cb_new_my_transactions(arrUnits) {
				if (socket.readyState === 3) {
					eventBus.removeListener('new_my_transactions', cb_new_my_transactions);
					return;
				}
				socket.send(JSON.stringify({
					id: -2,
					name: 'new_my_transactions',
					status: 1,
					result: {arrUnits}
				}));
			});
			break;

		case 'new_joint':
			eventBus.on('new_joint', function cb_new_joint(objJoint) {
				if (socket.readyState === 3) {
					eventBus.removeListener('new_joint', cb_new_joint);
					return;
				}
				socket.send(JSON.stringify({
					id: -2,
					name: 'new_joint',
					status: 1,
					result: {objJoint}
				}));
			});
			break;

		case 'my_transactions_became_stable':
			eventBus.on('my_transactions_became_stable', function cb_my_transactions_became_stable(arrUnits) {
				if (socket.readyState === 3) {
					eventBus.removeListener('my_transactions_became_stable', cb_my_transactions_became_stable);
					return;
				}
				socket.send(JSON.stringify({
					id: -2,
					name: 'my_transactions_became_stable',
					status: 1,
					result: {arrUnits}
				}));
			});
			break;

		default:
			return 'not found';
	}
	return 'ok';
}

module.exports = subscribe;