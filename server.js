const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const request = require("request");
const fs = require("fs");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const os  = require("os");
const ytlist = require('youtube-playlist');
const client = new Discord.Client();
const {prefix} = require('./config.json');
var isplaying = false;
var stop = false;
var url = "https://www.youtube.com/playlist?list=PL73ecBmhh04WUFUSThHepNRXb5nBsBXcY";
var localarray = [];


require('dotenv/config');
//heruko proof
const http = require("http");
const port  = process.env.PORT || 3000;
http.createServer().listen(port);
const token = process.env.TOKEN;


client.once('ready', () => {
    console.log('Zen Bot Ready!');
    client.user.setActivity("Zen-Kun Radio 24/7 Hemantk|| ^help");
    ytlist(url,['id', 'name', 'url']).then(res => {
        localarray=[...res.data.playlist];
       //localarray.push(res.data.playlist);
        console.log(res.data);
       console.log("Array value 1 : ",localarray); 
    
                                                 });
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
                .setDescription("**Zen - kun Nightcore Radio already Playing**...")
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
        if(message.content.startsWith(prefix+"gimi"))
        {
            console.log("value fetching : "+localarray[((localarray.length)-1)].url);
            message.channel.send("```"+localarray[((localarray.length)-1)].url+"```");
            
            
        }
        if(message.content.startsWith(prefix+"help"))
        {
            let embedd = new Discord.RichEmbed() 
                .setTitle(":headphones: **Zen NightCore 24x7 Music Bot** :white_check_mark:  ")
                .setColor("RANDOM")
                .addField("Zen-kun : ",url,false)
                .addField("ping ",prefix+"ping",false)
                .addField("check track playing ",prefix+"track",false)
                .addField("[admin-rights]start Radio manually",prefix+"zenplay",false)
                .addField("[admin-rights]stop Radio manually",prefix+"stop",false)
                .setDescription("Hey ! ZenBot here , created by Hemantk(Otaku)\nyou can go through official zenkun nightcore Radio Link in below so in end Enjoy Nightcores ! :heart: ...")
                .setThumbnail(client.user.displayAvatarURL);
                       
                message.channel.send(embedd);
        }
        if(message.content.startsWith(prefix+"track"))
        {
            if(localarray != null)
            {
                let tex = "```diff"+"\n-Current Playing :..\n";
                let ms = message.member.voiceChannel.connection.dispatcher.totalStreamTime;
                 hr = Math.floor(ms / 1000 / 60 / 60),
                 mn = Math.floor(ms / 1000 / 60 % 60),
                 ss = Math.round(ms / 1000 % 60 % 60);
       
                 function format(number = 0) {
                          return `0${number}`.slice(-2);
                                             }
                 fetchVideoInfo(localarray[0].id, function(err ,videoInfo){
                 if(err) throw new Error(err);
                 
                 let embed = new Discord.RichEmbed()
                 .setColor("RANDOM")
                 .setTitle(videoInfo.genre)
                 .setDescription(tex+videoInfo.title+"\n"+"-Time Elapsed : "+`${hr}:${format(mn)}:${format(ss)}`+"\n```")
                 .setThumbnail(videoInfo.thumbnailUrl)
                 .addField("Link :",videoInfo.url,false) 
                 .setFooter("UwU , so u using Yui Bot  !",client.user.displayAvatarURL);          
                     message.channel.send(embed);
                     //message.channel.send(tex+videoInfo.title+"\n"+"Link : "+videoInfo.url+"\n-Time Elapsed : "+`${hr}:${format(mn)}:${format(ss)}`+"\n```");
                     
                     console.log(`${hr}:${format(mn)}:${format(ss)}`);
             });
     
            }
        }
        

    });
    
   



    //function's on below !

    function play_stream()
    {
        const voicechannel = client.channels.get('594409374122770432');
        if (!voicechannel) return console.error("The channel does not exist!");
        voicechannel.join()
        .then(connection =>{
            

        let stream = ytdl(localarray[0].url).on("error", err =>{
            client.user.setActivity("stream went offline!");
            console.log(err);
        });
        isplaying = true;
        console.log("stream started!");
        let dispatcher = connection.playStream(stream);
        console.log("current playing Item : name "+localarray[0].name+"  ||  url : "+localarray[0].url);

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
                client.user.setActivity("Zen-Kun Radio 24/7 Hemantk|| ^help");
                console.log("Next track started : ")
                localarray.push(localarray.shift());
                play_stream();

            } 
            
        })
        dispatcher.on('error', function(){
            message.channel.send("sorry stream is Offline !")
        })
                        });
  console.log("Successfully connected.");

    }
        function isYouTube(str) {
        return str.toLowerCase().indexOf("youtube.com") > -1;
                                }

     function GeneratePlaylist(url,localarray)
      {
        ytlist(url,['id', 'name', 'url']).then(res => {
            localarray=[...res.data.playlist];
           //localarray.push(res.data.playlist);
            console.log(res.data);
           console.log("Array value 1 : ",localarray);
            
    
                                                      });

      }





client.on('error', err =>{
    console.log(err);
})
client.login(token);