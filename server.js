const core = require('biot-core');
const net = require('./core');
const subscribe = require('./subscribe');
const channels = require('./channels');

const PORT = 3303;

async function Start() {
	await core.init('test');
	await channels.init();

	return net.createServer([
		core.getWallets,
		core.getMyDeviceWallets,
		core.getAddressesInWallet,
		core.createNewWallet,
		core.createNewAddress,
		core.getWalletBalance,
		core.getAddressBalance,
		core.sendTextMessageToDevice,
		core.sendTechMessageToDevice,
		core.sendPaymentFromWallet,
		core.sendPaymentFromWalletUseUnstableUnits,
		core.getListTransactionsForAddress,
		core.getListTransactionsForWallet,
		core.myAddressInfo,
		core.signDevicePrivateKey,
		core.signWithAddress,
		core.verifySign,
		core.addCorrespondent,
		core.removeCorrespondent,
		core.listCorrespondents,
		subscribe,
		channels.subscribeToChannelUpdates,
		channels.channel,
		channels.newChannel
	], {port: PORT});
}

Start().then(() => console.log('start')).catch(console.error);