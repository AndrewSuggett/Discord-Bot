const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const { compileFunction } = require('vm');

const publicIp = require('public-ip'); //Package to show public IP

const spawn = require('child_process').spawn;
var kill  = require('tree-kill'); //Need to install package to kill server and all child proccess

//Server object set to null, program may not work if not launched through bot as we assume server is not already running
var mcserver = null; 

var MC_SERVER_START_SCRIPT = "C:\\Users\\YourUserName\\Desktop\\DiscordBot\\start.bat"; //Locatioan of bat file


client.on('message', message  => {
    if (message.content === '!status' || message.content === '!Status')
    {
        
        //To tell if server is up or not
        if(mcserver !== null)
        {
            //If server is up
            message.channel.send('Server is running!');
        }
        else
        {
            message.channel.send('Server is down.');
        }
    }

    else if(message.content === '!startServer')
    {
        if(mcserver == null) //If server is not running
        {
            
            mcserver = spawn(MC_SERVER_START_SCRIPT); //Opens the bat file that starts the server
            
            
            message.channel.send('Starting Server...');
            
           //logs data of server
            mcserver.stdout.on('data', (data) => {
                console.log("stdout: " + data);
              });

              mcserver.on('close', (code) => {
                console.log("child process exited with code " + code);
                message.channel.send("Server Shut Down!");
              });
              
        }
    }

    else if(message.content === '!stopServer')
    {
            
            //If the server is running
            if(mcserver !== null){
                message.channel.send("Stopping server...");
                kill(mcserver.pid); //Kills the server and all child proccess
                mcserver = null; //Sets the server object back to null aka server is not running.
            }
    }

    //Shows ip of server aka my public ip
    else if(message.content === '!IP' || message.content === '!ip')
    {
        (async () => {
            message.channel.send(await publicIp.v4());
        })();
    }
    
});



client.login('YourTokenHere'); //Put your discord bot token here