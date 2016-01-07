import assert from 'assert';
import WebSocket from 'ws';

import log from './log';
import * as tunnelClient from './tunnel-client';
import {} from './ws-monkey-patch';

const serverUrl = process.env.TC_SERVER_URL || 'ws://localhost:8080/ws';
const hospitalId = process.env.TC_NETWORK_ID;
const reconnectInterval = process.env.TC_PING_INTERVAL || 4;

assert(hospitalId, 'Must provide a valid hospital ID');

log(`Connecting to ${serverUrl}`);

function connect() {
  const ws = new WebSocket(serverUrl);

  ws.on('open', () => {
    log('Succesful connection established');

    ws.sendCommand('REGISTER_HOSPITAL', hospitalId);
  });

  ws.on('close', (code, message) => log('Connection closed', code, message));
  ws.on('error', error => log('An error was thrown, connection closed', error));

  ws.onCommand('OPEN_TUNNEL', data => {
    const { tunnelPort, tunnelServerUrl, netloc } = data;
    tunnelClient.open(tunnelPort, tunnelServerUrl, netloc);
  });
}

connect();
