const { Client, RichEmbed, Collection } = require('discord.js');
const { config } = require("dotenv");
const usedCommandRecently4 = new Set();
const client = new Client({
    disableEveryone: true
})
const readline = require('readline');
const express = require('express');
const keepalive = require('express-glitch-keepalive');

const app = express();

app.use(keepalive);

app.get('/', (req, res) => {
res.json('This bot should be online! Uptimerobot will keep it alive');
});
app.get("/", (request, response) => {
response.sendStatus(200);
});


// Collections
client.commands = new Collection();
client.aliases = new Collection();

config({
    path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
  client.user.setActivity(` -help | Reached ${client.users.size} members.`);
});


client.on("message", async message => {
    const prefix = "-";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args);
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'welcome');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
  process.exit(1);
});

client.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'bye');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Bye Come Back Soon, ${member}`);
});


  
client.on('message', message => {
    // If the message is "how to embed"
    if (message.content === '-help') {
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
      const embed = new RichEmbed()
        // Set the title of the field
      .setColor(0xFF0000)
      .addField("stock", "Tells you about the stock.")
      .addField("hulu", "Give you a Hulu account.")
      .addField("origin", "Gives you an Origin account.")
      .addField("spotify", "Gives you a spotify account.")
      .addField("nordvpn", "Gives you a NordVpn account.")
      .addField("genfortnite", "Gives you a fortnite account.")
      .addBlankField()
      .addField("new", "Makes a ticket for you.")
      .addField("close", "Closes the ticket for you.")
      .addField("report @(user) (reason)", "Reports a user.")
      .addBlankField()
       .addField("instagram (username)", "Gives you information about an account.")
      .addField("fortnite (fortnite name)", "Tells you information about a fortnite account.")
      .addField("love @(discordname)" , "Know how much a person loves you.")
      .addField("rps" , "Play Rock-Paper-Scissors with the bot.")
       .addField("meme" , "Sends you popular memes from reddit.")
      .addField("stats", "Shows you the bot and server stats.")
      .addBlankField()
      .addField("Inv", "Invite the bot to your server.")
      .setFooter("Don't Forget to share the server with your friends and family!")
      message.channel.send(embed);
    }
  });





client.on('message', message => {
    // If the message is "how to embed"
    if (message.content === '-stats') {
message.channel.send(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`)
    }
  });


client.on('message', message => {
    switch(message.content.toUpperCase()) {
        case '-RESET':
            resetBot(message.channel);
            break;

        // ... other commands
    }
});

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send('Resetting...')
    process.exit(1);
}

var userTickets = new Map(); // Create a JS Map Object.


client.on('ready', () => {
    console.log(client.user.username + " has logged in.");
});

client.on('message', message => {
   
    /**
     *  Check to see if the command and the message was sent in the correct channel. In the video, I had a channel
     * called "Support" and that will serve as our channel to create tickets in. Make sure you change it to fit your needs or
     * get rid of it.
     */
    if(message.content.toLowerCase() === '-new' && message.channel.id === '679657994287317004') {
        
        /**
         * Check if the map has the user's id as a key
         * We also need to check if there might be another channel the bot made that it did not delete, (could've been from an old ticket but the bot crashed so the channel was not closed/deleted.)
         */
        if(userTickets.has(message.author.id) || 
        message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.author.send("You already have a ticket!");
        } 
        else {
            let guild = message.guild;
            /**
             * Create the channel, pass in params.
             * Make sure you assign appropriate permissions for each role.
             * If you have additional roles: e.g Moderator, Trial Mod, etc. each of them needs permissions for it.
             * You can choose to set up additional permissions.
             */
            guild.createChannel(`${message.author.username}s-ticket`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        allow: 'VIEW_CHANNEL',
                        id: message.author.id
                    },
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: 'VIEW_CHANNEL',
                        id: '618029803517509647'
                    }
                ]
            }).then(ch => {
                userTickets.set(message.author.id, ch.id);
              message.channel.send("We will be with you shortly, please wait...")
              message.channel.send(ch.id)
                      const embed = new RichEmbed()
                .setColor(0xCF40FA)
                .addField(`Hey ${message.author.username}!`, `Please try explain why you opened this ticket with as much detail as possible. Our **Support Staff** will be here soon to help.`)
                .setTimestamp();
            message.guild.send({
                embed: embed
            });
        }).catch(console.error); // Send errors to console
    // Once our channel is created, we set the map with a key-value pair where we map the user's id to their ticket's channel id, indicating that they have a ticket opened.
            
            
        }
    }

    else if(message.content.toLowerCase() === '-close') { // Closing the ticket.
        if(userTickets.has(message.author.id)) { // Check if the user has a ticket by checking if the map has their ID as a key.
            if(message.channel.id === userTickets.get(message.author.id)) {
                message.channel.delete('closing ticket') // Delete the ticket.
                .then(channel => {
                    console.log("Deleted " + channel.name);
                    userTickets.delete(message.author.id);
                })
                .catch(err => console.log(err));
            }
        }
        /** 
         * Here we will check the server to see if there were additional tickets created that the bot may have missed due to 
         * either crashing, restarting, etc.. This part will delete ALL of the tickets that follow the format of 
         * "<username>s-ticket" because that was the way we hard-coded. You can modify this obviously.
         */
        if(message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.guild.channels.forEach(channel => {
                if(channel.name.toLowerCase() === message.author.username + 's-ticket') {
                    channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
                    .catch(err => console.log(err));
                }
            });
        }
    }
});




client.login("NjI3MTkwOTIxOTg5MDYyNjc3.XkfvdA.qK3bzIUexvYf3SwVuCDMPxzk4Oo");