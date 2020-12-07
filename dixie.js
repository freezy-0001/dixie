const Discord = require('discord.js');
const {
    prefix,
    token
} = require('./config.json');
const client = new Discord.Client();
const path = require('path');
const GoogleAssistant = require('google-assistant');
var gtts = require('node-gtts')('en');
var filepath = path.join(__dirname, 'answer.wav');

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command == 'hey') {
        if (args[0].toLowerCase() == null) {
            return 0;
        } else {
            if (args[0].toLowerCase() == "dixie") {
                if (message.member.voice.channel == null) {
                    const notInVoiceChannel = new Discord.MessageEmbed()
                        .setColor('#1AADFF')
                        .setTitle(`You are not in a voice channel.`)

                    message.channel.send(notInVoiceChannel);
                } else {
                    if (message.member.voice.channel.name.toLowerCase() == 'dixie') {
                        if (args[1] == null) {
                            const questionError = new Discord.MessageEmbed()
                                .setColor('#1AADFF')
                                .setTitle(`Please, ask something!`)
                                .setDescription(`*example: hey dixie how are you?*`)
                            message.channel.send(questionError);
                        } else {
                            if (message.content.slice(10).length <= 256) {

                                const config = {
                                    auth: {
                                        keyFilePath: path.resolve(__dirname, 'client_secret_xyz.json'),

                                        savedTokensPath: path.resolve(__dirname, 'tokens.json')
                                    },

                                    conversation: {
                                        audio: {
                                            encodingIn: 'LINEAR16',
                                            sampleRateIn: 16000,
                                            encodingOut: 'LINEAR16',
                                            sampleRateOut: 24000,
                                        },
                                        lang: 'en-US',
                                        deviceModelId: 'deviceModelId',
                                        deviceId: 'deviceId',
                                        deviceLocation: {
                                            coordinates: {
                                                latitude: -x.xxxx,
                                                longitude: -xx.xxxx,
                                            },
                                        },
                                        textQuery: `${message.content.slice(10)}`,
                                        isNew: true,
                                        screen: {
                                            isOn: false,
                                        },
                                    },
                                };

                                const assistant = new GoogleAssistant(config.auth);

                                const startConversation = (conversation) => {

                                    conversation
                                        .on('response', (text) => {

                                            if (text.length < 1) {
                                                message.member.voice.channel.join().then(async connection => {


                                                    console.log(text)
                                                    await gtts.save(filepath, `Sorry, I can't answer your question.`, function() {
                                                        console.log('Exported.');
                                                    })
                                                    var tag = message.author.tag
                                                    var username = tag.slice(0, tag.length - 5)

                                                    const successDixie = new Discord.MessageEmbed()
                                                        .setColor('#1AADFF')
                                                        .setAuthor(username, message.author.displayAvatarURL(), 'https://freezy.dev')
                                                        .setTitle(message.content.slice(10))
                                                        .setDescription("Sorry, I can't answer your question.")

                                                    await message.channel.send(successDixie);
                                                    const dispatcher = await connection.play(require("path").join(__dirname, './answer.wav'));
                                                }).catch(err => console.log(err));
                                            } else {
                                                message.member.voice.channel.join().then(async connection => {

                                                    var tag = message.author.tag
                                                    var username = tag.slice(0, tag.length - 5)
                                                    console.log(text)
                                                    await gtts.save(filepath, text.replace("freezy0001", username), function() {
                                                        console.log('Exported.');
                                                    })
                                                    

                                                    const successDixie = new Discord.MessageEmbed()
                                                        .setColor('#1AADFF')
                                                        .setAuthor(username, message.author.displayAvatarURL())
                                                        .setTitle(message.content.slice(10))
                                                        .setDescription(text.replace("freezy0001", username))

                                                    await message.channel.send(successDixie);
                                                    const dispatcher = await connection.play(require("path").join(__dirname, './answer.wav'));
                                                }).catch(err => console.log(err));
                                            }

                                        })
                                };

                                assistant
                                    .on('ready', () => assistant.start(config.conversation))
                                    .on('started', startConversation);



                            } else {
                                const maxCharacterError = new Discord.MessageEmbed()
                                    .setColor('#1AADFF')
                                    .setTitle(`The question lenght must be 256 or fewer.`)
                                message.channel.send(maxCharacterError);
                            }
                        }
                    } else {
                        const notInVoiceChannelNamedDixie = new Discord.MessageEmbed()
                            .setColor('#1AADFF')
                            .setTitle(`You can only talk to Dixie in a voice channel named **#dixie**.`)
                            .setDescription(`If you don't find this channel, please contact the server administrators!`)
                        message.channel.send(notInVoiceChannelNamedDixie);
                    }
                }
            }
        }
    }
    
});

client.login(token);