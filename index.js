const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const os  = require("os");
const client = new Discord.Client();
const {prefix} = require('./config.json');
var isplaying = false;
var stop = false;
var url = "https://www.youtube.com/watch?v=J20u_NrRI-s";

require('dotenv/config');
//heruko proof
const http = require("http");
const port  = process.env.PORT || 3000;
http.createServer().listen(port);
const token = process.env.TOKEN;


client.once('ready', () => {
    console.log('Zen Bot Ready!');
    client.user.setActivity("Zen-Kun Radio 24/7 Hemantk|| "+prefix+"help");
    play_stream();
    isplaying = true;
    
    });

    client.on('message', message=>{
        if(message.content.startsWith(prefix+"ping"))
        {
            let embedd = new Discord.RichEmbed() 
                                    .setColor("RANDOM")
                                    .setDescription(":ping_pong: ping : "+Math.floor(client.ping)+"ms");

                                               
                    message.channel.send(embedd);
        }
        if(message.content.startsWith(prefix+"zenplay"))
        {
            if(isplaying  == false)
            {
                play_stream();
                isplaying = true;
            }
            else
            {
                let embedd = new Discord.RichEmbed() 
                .setColor("RANDOM")
                .setDescription("**Zen - kun Nightcore Radio already Playing**...\n  url:"+url)
                .setThumbnail(client.user.displayAvatarURL);
                       
                message.channel.send(embedd);
            }
            
        }
        if(message.content.startsWith(prefix+"stop"))
        {
            if(!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("sorry , bot u dont have permission to stop ",client.user.tag,"from streaming !")
            if(isplaying ==true){
                stop = true;
                message.member.voiceChannel.connection.dispatcher.end();
                isplaying = false;
            }
            else
            {
                message.reply("dude , Nothing is playing right now..")
            }
            
            
        }
        if(message.content.startsWith(prefix+"help"))
        {
            let embedd = new Discord.RichEmbed() 
                .setTitle(":headphones: **Zen NightCore 24x7 Music Bot** :white_check_mark:  ")
                .setColor("RANDOM")
                .addField("Zen-kun : ",url,false)
                .addField("ping ",prefix+"ping",false)
                .addField("[admin-rights]start Radio manually",prefix+"zenplay",false)
                .addField("[admin-rights]stop Radio manually",prefix+"stop",false)
                .setDescription("Hey ! ZenBot here , created by Hemantk(Otaku)\nyou can go through official zenkun nightcore Radio Link in below so in end Enjoy Nightcores ! :heart: ...")
                .setThumbnail(client.user.displayAvatarURL);
                       
                message.channel.send(embedd);
        }
        

    });
   



    //function's on below !

    function play_stream()
    {
        const voicechannel = client.channels.get('594409374122770432');
        if (!voicechannel) return console.error("The channel does not exist!");
        voicechannel.join()
        .then(connection =>{

        let stream = ytdl(url,{ highWaterMark: 1<<25 }).on("error", err =>{
            client.user.setActivity("stream went offline in at Inndex start!");
            voicechannel.leave();
            play_stream();
            console.log(err);
        });
        isplaying = true;
        console.log("stream started!");
        let dispatcher = connection.playStream(stream);
        client.user.setActivity("Zen-Kun Radio 24/7 Hemantk|| "+prefix+"help");
        dispatcher.on('end',function(){
            if(stop == true)
            {
                    stop = false;
                    isplaying = false;
                    dispatcher.destroy();
                    voicechannel.leave();

            }
            else
            {
                console.log("connection down restarting stream...");
                dispatcher.destroy();
                voicechannel.leave();
                play_stream();

            } 
            
        })
        dispatcher.on('error', function(){
            voicechannel.leave();
            client.user.setActivity("stream went offline in at dispacther");
            play_stream();
        })
                        });
  console.log("Successfully connected.");

    }
    
client.on('error', err =>{
    console.log(err);
})
client.login(token);