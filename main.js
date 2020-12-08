const fetch = require("node-fetch");

const express = require('express');
const app = express();
const PORT = 3000;
const HOST = 'localhost'
//------------------------------------------------------------------------------
const Discord = require('discord.js');
const client = new Discord.Client();
//------------------------------------------------------------------------------
const redirect_uri='http://localhost:3000/discord';
const app_id = 'discord client id';
const app_secret = 'discord client secret';
//------------------------------------------------------------------------------
let access_token='hardcoding access token for testing';


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  else if(msg.content === 'info') {
	fetch('https://discordapp.com/api/v6/users/@me/connections', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + access_token,
		}})
		.then(res => res.json())
		.then(json => {
			console.log(json);
			console.log(typeof json)
			let channel = client.channels.cache.get('channel id');
			json.forEach(x => channel.send(JSON.stringify(x)));
		});
  }
});

client.login('Bot token, not sure if needed');


//------------------------------------------------------------------------------
app.get('/', (req, res) => res.json({test:"test"}));
//------------------------------------------------------------------------------

app.all('/discord', ((req, res) => fetch('https://discordapp.com/api/v6/oauth2/token', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	body: new URLSearchParams({
		client_id: app_id,
		client_secret: app_secret,
		grant_type: 'authorization_code',
		code: req.query.code,
		redirect_uri: redirect_uri,
		scope: 'identify email bot connections'
	})})
	.then(res => res.json())
	.then(json => {
		access_token = json.access_token;
		console.log(json)
		})));

app.listen(PORT, HOST, () => console.log('Listening @ '+HOST+' on port '+PORT+'...'));