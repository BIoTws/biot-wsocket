const ws = require('ws');


function Start() {
    let client = new ws('ws://127.0.0.1:3303');

    client.on('open', function() {
        let getWallet = {
            id: 1,
            name: 'getMyDeviceWallets',
            args: []
        };

        client.on('message', function(stateData) {
            stateData = JSON.parse(stateData);
 
            console.log(stateData);
        });

        client.send(JSON.stringify(getWallet));
        
    });
}

Start();