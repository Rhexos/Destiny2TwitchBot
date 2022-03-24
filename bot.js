'use strict';
const tmi = require('tmi.js');
const fs = require('fs');
const url = require('https');
const QuriaAPI = require('quria');
require('dotenv').config()
//console.log(process.env)

const quria = new QuriaAPI({
	API_KEY: "2631dbafe8c34c1eb84caafa8d7cb8d5"
});

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: ["rhexos", "ampfy"]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();
  
  if (commandName === '!currentls') {
		//fs.readFile('lostsectors.json', (err, data) => {
		fs.readFile('currentdailies.json', (err, data) => {
			if (err) throw err;
			let currentLS = JSON.parse(data);
			console.log(currentLS.lostSector.name)
			client.say(target, `Current LS: ${currentLS.lostSector.name} in 
																			${currentLS.lostSector.location} 
																			(${currentLS.lostSector.armor})`);
		});
    console.log(`* Executed ${commandName} command in channel ${target}`);
  }
  if (commandName === '!reset') {
		now = new Date();
		msBeforeReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
		if (msBeforeReset < 0) {
			msBeforeReset += 86400000; // it's after reset, try 12pm tomorrow.
		}
		console.log(`* Executed ${commandName} command in channel ${target}`);
		client.say(target, `Time remaining until daily reset: ${convertMsToTime(msBeforeReset)}`);
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds) {
	let seconds = Math.floor(milliseconds / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	seconds = seconds % 60;
	minutes = minutes % 60;

	return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds,)}`;
}

var lostSectorCount = 1;
var armorCount = 1;
var now = new Date();
var msBeforeReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
if (msBeforeReset < 0) {
    msBeforeReset += 86400000; // it's after reset, try 12pm tomorrow.
}

function intervalFunc() {
    console.log(`Daily Reset has occured.`);
    lostSectorCount += 1;
    armorCount += 1;
}

//quria.destiny2
//	.GetPublicVendors(DestinyComponentType="VendorSales")
//	.then((res) => {
//		console.log(res.data.Response);
//	})
//	.catch((error) => {
//		console.log(error.response.data);
//	})

setTimeout(function(){
    console.log(`Daily Reset has occured.`);
    lostSectorCount += 1;
    armorCount += 1;
    msBeforeReset = 86400000;
    setInterval(intervalFunc, msBeforeReset);
}, msBeforeReset);

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
