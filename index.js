require('dotenv').config();
const 
    info = require('./handlers/info'),
    game = require('./handlers/game'),
      user = require('./handlers/user');

const botMention = `<@${process.env.BOTID}>`;

const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready');
})

client.on('message', message => {
  let callingUser = message.author;
  if (message.author.bot) return;
  let commands = parseCommands(message.content);
  switch(commands.action) {
    case 'help':
    case 'info':
      info(callingUser);
      break;
    case 'game' :
      game(callingUser, commands);
      break;
    case 'user' :
      user(callingUser, commands);
      break;
  }
})

client.login(process.env.SECRET);


function parseCommands(content) {
  if (content.startsWith(botMention)) {
    content = content.substring(botMention.length, content.length).trim();
  }
  let action = getAction(content);
  return {action: action, command: getCommand(action, content)};
}

function getAction(content) {

  return content.split(" ")[0].toLowerCase();
}

function getCommand(action,content) {
  return content.substring(action.length, content.length).trim();
}
