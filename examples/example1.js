const wsclient = require('biot-wsclient');
const ws = require('ws');


function Start() {
    let client = new ws('ws://127.0.0.1:3303');

    client.on('open', async () => {
        let stream = wsclient(client);

        let result = await stream.send({
            name: 'getMyDeviceWallets', args: []
        });


        console.log(result[1]);
    });

}

Start();