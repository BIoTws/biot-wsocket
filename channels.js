const biotCore = require('biot-core');
const ChannelsManager = require('biot-core/lib/ChannelsManager');

let sockets = [];
let channels = {};
let channelsManager;

exports.init = async () => {
	let wallets = await biotCore.getMyDeviceWallets();
	channelsManager = new ChannelsManager(wallets[0]);
	channelsManager.events.on('newChannel', async (objInfo) => {
		channels[objInfo.id] = channelsManager.getNewChannel(objInfo);
		channels[objInfo.id].events.on('error', error => {
			send({
				channelId: objInfo.id,
				event: 'error',
				error
			});
		});
		channels[objInfo.id].events.on('start', () => {
			send({
				channelId: objInfo.id,
				event: 'start'
			});
		});
		channels[objInfo.id].events.on('ready', () => {
			send({
				channelId: objInfo.id,
				event: 'ready'
			});
		});
		channels[objInfo.id].events.on('changed_step', (step) => {
			send({
				channelId: objInfo.id,
				event: 'changed_step',
				step
			});
		});
		channels[objInfo.id].events.on('new_transfer', (amount, message) => {
			send({
				channelId: objInfo.id,
				event: 'new_transfer',
				amount,
				message
			});
		});
		await channels[objInfo.id].init();
		send({
			channelId: objInfo.id,
			event: 'newChannel',
			info: channels[objInfo.id].info()
		});
	});
};

exports.subscribeToChannelUpdates = function subscribeToChannelUpdates(socket) {
	if (sockets.indexOf(socket) === -1) sockets.push(socket);
};

exports.newChannel = async function newChannel(opts) {
	let device = require('byteballcore/device');
	opts.myDeviceAddress = device.getMyDeviceAddress();
	let newChannel = channelsManager.newChannel(opts);
	channels[newChannel.id] = newChannel;
	channels[newChannel.id].events.on('error', error => {
		send({
			channelId: newChannel.id,
			event: 'error',
			error
		});
	});
	channels[newChannel.id].events.on('start', () => {
		send({
			channelId: newChannel.id,
			event: 'start'
		});
	});
	channels[newChannel.id].events.on('ready', () => {
		send({
			channelId: newChannel.id,
			event: 'ready'
		});
	});
	channels[newChannel.id].events.on('changed_step', (step) => {
		send({
			channelId: newChannel.id,
			event: 'changed_step',
			step
		});
	});
	channels[newChannel.id].events.on('new_transfer', (amount, message) => {
		send({
			channelId: newChannel.id,
			event: 'new_transfer',
			amount,
			message
		});
	});
	channels[newChannel.id].init();
	return newChannel.id;
};


exports.channel = async function channel(channelId, command, params) {
	if (!channels[channelId]) return false;
	let _channel = channels[channelId];

	switch (command) {
		case 'approve':
			return _channel.approve();
		case 'reject':
			return _channel.reject();
		case 'transfer':
			return _channel.transfer(parseInt(params[0]), params[1] || null);
		case 'closeMutually':
			return _channel.closeMutually();
		case 'closeOneSide':
			return _channel.closeOneSide();
	}
};

function send(objMessage) {
	objMessage.id = -2;
	objMessage.name = 'channel';
	objMessage.status = 1;
	let message = JSON.stringify(objMessage);

	sockets.forEach((socket, index) => {
		if (socket.readyState === 3) {
			sockets.splice(index, 1);
			return;
		}
		socket.send(message);
	});
}