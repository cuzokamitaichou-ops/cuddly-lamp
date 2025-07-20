const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { db, botSettings, aiSettings, blacklistedUsers, botStats, eq } = require('./db.cjs');

// Bot token from dashboard
const BOT_TOKEN = "MTM5NjM1NDc2Njk3NTY2ODM3NQ.Ge9-jH.72H-9iLZTs-7cbDflwM-8NCHBVMqcFbLJBAeLQ";

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// Commands collection
client.commands = new Collection();

// Bot startup
client.once('ready', async () => {
    console.log(`❄️ Snow bot is online! Logged in as ${client.user.tag}`);
    
    // Update bot stats
    try {
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        await updateBotStats({
            servers: guildCount,
            users: userCount,
            commands: 0,
            blacklisted: 0
        });
        
        console.log(`📊 Bot Stats: ${guildCount} servers, ${userCount} users`);
    } catch (error) {
        console.error('Failed to update bot stats:', error);
    }
    
    // Set bot status
    try {
        const settings = await getBotSettings();
        if (settings) {
            const status = settings.status === 'dnd' ? 'dnd' : 
                          settings.status === 'offline' ? 'invisible' : 'online';
            
            client.user.setPresence({
                status: status,
                activities: settings.customStatus ? [{
                    name: settings.customStatus,
                    type: 4 // Custom status
                }] : []
            });
        }
    } catch (error) {
        console.error('Failed to set bot status:', error);
    }
});

// Helper functions for database
async function getBotSettings() {
    try {
        const [settings] = await db.select().from(botSettings).limit(1);
        return settings;
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
}

async function getAiSettings() {
    try {
        const [settings] = await db.select().from(aiSettings).limit(1);
        return settings;
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
}

async function updateBotStats(stats) {
    try {
        const existing = await db.select().from(botStats).limit(1);
        if (existing.length > 0) {
            await db.update(botStats)
                .set({ ...stats, updatedAt: new Date() })
                .where(eq(botStats.id, existing[0].id));
        } else {
            await db.insert(botStats).values({ ...stats, updatedAt: new Date() });
        }
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

async function isBlacklisted(userId) {
    try {
        const [user] = await db.select().from(blacklistedUsers).where(eq(blacklistedUsers.id, userId));
        return !!user;
    } catch (error) {
        console.error('Database error:', error);
        return false;
    }
}

// Economy system - simple implementation
const economy = {
    users: new Map(),
    
    getBalance(userId) {
        return this.users.get(userId) || 0;
    },
    
    addMoney(userId, amount) {
        const current = this.getBalance(userId);
        this.users.set(userId, current + amount);
        return current + amount;
    },
    
    removeMoney(userId, amount) {
        const current = this.getBalance(userId);
        const newBalance = Math.max(0, current - amount);
        this.users.set(userId, newBalance);
        return newBalance;
    }
};

// Message handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Check if user is blacklisted
    if (await isBlacklisted(message.author.id)) {
        return; // Silently ignore blacklisted users
    }
    
    // AI Chatbot mode - respond to mentions
    if (message.mentions.has(client.user) && !message.content.startsWith('!')) {
        try {
            const aiSettings = await getAiSettings();
            if (aiSettings) {
                // Simulate typing based on response speed
                await message.channel.sendTyping();
                
                const delay = aiSettings.responseSpeed === 'Fast Response' ? 1000 :
                             aiSettings.responseSpeed === 'Slow & Thoughtful' ? 3000 : 2000;
                
                setTimeout(async () => {
                    const responses = [
                        "Hiya! ❄️ I'm Snow, your kawaii winter companion! What can I help you with today? ✨",
                        "Ooh, you mentioned me! 👀 I was just here watching everything... how can I assist? 💙",
                        "Kyaa~ Someone called for me! ❄️ I'm always here and ready to help my friends! 🌨️",
                        "Hewo! Snow here! ✨ Always watching and ready to make your day more magical! ❄️",
                        "Uwu~ You got my attention! I love chatting with everyone~ How are you doing? 💙"
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    await message.reply(randomResponse);
                }, delay);
            }
        } catch (error) {
            console.error('AI response error:', error);
        }
        return;
    }
    
    // Command handling
    if (!message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Update command stats
    try {
        const stats = await db.select().from(botStats).limit(1);
        if (stats.length > 0) {
            await db.update(botStats)
                .set({ commands: stats[0].commands + 1, updatedAt: new Date() })
                .where(eq(botStats.id, stats[0].id));
        }
    } catch (error) {
        console.error('Failed to update command stats:', error);
    }
    
    // Economy Commands
    if (command === 'balance' || command === 'bal') {
        const balance = economy.getBalance(message.author.id);
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ Snow Bank')
            .setDescription(`**${message.author.username}**\n💎 Balance: **${balance}** Snow Crystals`)
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'daily') {
        const dailyAmount = Math.floor(Math.random() * 100) + 50;
        const newBalance = economy.addMoney(message.author.id, dailyAmount);
        
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ Daily Snow Crystals!')
            .setDescription(`You collected **${dailyAmount}** Snow Crystals!\n💎 New Balance: **${newBalance}**`)
            .setFooter({ text: 'Come back tomorrow for more crystals!' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'work') {
        const workAmount = Math.floor(Math.random() * 75) + 25;
        const newBalance = economy.addMoney(message.author.id, workAmount);
        
        const jobs = [
            'building snowmen ⛄',
            'catching snowflakes ❄️',
            'delivering winter magic ✨',
            'spreading kawaii vibes 💙',
            'organizing ice crystals 🔮'
        ];
        
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ Work Complete!')
            .setDescription(`You worked ${randomJob} and earned **${workAmount}** Snow Crystals!\n💎 New Balance: **${newBalance}**`)
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    // Fun Commands
    else if (command === 'hug') {
        const target = message.mentions.users.first() || message.author;
        const hugGifs = [
            'https://tenor.com/view/hug-anime-cute-kawaii-gif-12345',
            'https://tenor.com/view/snow-hug-winter-cute-gif-67890'
        ];
        
        const embed = new EmbedBuilder()
            .setColor('#FFB6C1')
            .setTitle('🤗 Warm Winter Hug!')
            .setDescription(`**${message.author.username}** gives ${target.id === message.author.id ? 'themselves' : target.username} a cozy hug! ❄️💙`)
            .setImage(hugGifs[Math.floor(Math.random() * hugGifs.length)])
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'snowball') {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❄️ Who do you want to throw a snowball at? Mention someone!');
        }
        
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ Snowball Fight!')
            .setDescription(`**${message.author.username}** throws a fluffy snowball at **${target.username}**! 🎯❄️`)
            .setImage('https://tenor.com/view/snowball-fight-winter-fun-gif-12345')
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'cute' || command === 'kawaii') {
        const cuteResponses = [
            'Kyaa~ You think I\'m cute? >//< Thank you! ❄️✨',
            'Uwu~ You\'re so sweet! I try my best to be kawaii! 💙',
            'Hehe~ Winter magic makes everything cuter! ❄️🌨️',
            'Aww, you made my snow heart melt! 🥺💙',
            'Yay! Being cute is my specialty! ✨❄️'
        ];
        
        const response = cuteResponses[Math.floor(Math.random() * cuteResponses.length)];
        message.reply(response);
    }
    
    // Moderation Commands
    else if (command === 'kick') {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('❄️ You need kick permissions to use this command!');
        }
        
        const target = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        if (!target) {
            return message.reply('❄️ Please mention a user to kick!');
        }
        
        if (!target.kickable) {
            return message.reply('❄️ I cannot kick this user!');
        }
        
        try {
            await target.kick(reason);
            
            const embed = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setTitle('👢 User Kicked')
                .setDescription(`**${target.user.username}** has been kicked from the server.`)
                .addFields({ name: 'Reason', value: reason })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply('❄️ Failed to kick the user!');
        }
    }
    
    else if (command === 'ban') {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❄️ You need ban permissions to use this command!');
        }
        
        const target = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        if (!target) {
            return message.reply('❄️ Please mention a user to ban!');
        }
        
        if (!target.bannable) {
            return message.reply('❄️ I cannot ban this user!');
        }
        
        try {
            await target.ban({ reason });
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 User Banned')
                .setDescription(`**${target.user.username}** has been banned from the server.`)
                .addFields({ name: 'Reason', value: reason })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply('❄️ Failed to ban the user!');
        }
    }
    
    else if (command === 'clear' || command === 'purge') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❄️ You need manage messages permissions to use this command!');
        }
        
        const amount = parseInt(args[0]);
        
        if (!amount || amount < 1 || amount > 100) {
            return message.reply('❄️ Please provide a number between 1 and 100!');
        }
        
        try {
            const deleted = await message.channel.bulkDelete(amount + 1);
            
            const embed = new EmbedBuilder()
                .setColor('#87CEEB')
                .setTitle('🧹 Messages Cleared')
                .setDescription(`Successfully deleted **${deleted.size - 1}** messages!`)
                .setTimestamp();
            
            const reply = await message.channel.send({ embeds: [embed] });
            setTimeout(() => reply.delete(), 5000);
        } catch (error) {
            message.reply('❄️ Failed to clear messages!');
        }
    }
    
    // Meme Commands
    else if (command === 'meme') {
        const memeResponses = [
            'https://i.imgflip.com/1bij.jpg', // Drake meme template
            'https://i.imgflip.com/26am.jpg', // Surprised Pikachu
            'https://i.imgflip.com/1g8my4.jpg', // Distracted boyfriend
        ];
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('😂 Random Meme!')
            .setImage(memeResponses[Math.floor(Math.random() * memeResponses.length)])
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'joke') {
        const jokes = [
            'Why don\'t scientists trust atoms? Because they make up everything! 🧪',
            'Why did the snowman call his dog Frost? Because Frost bites! ❄️🐕',
            'What do you call a sleeping bull? A bulldozer! 😴🐂',
            'Why don\'t eggs tell jokes? They\'d crack each other up! 🥚😂',
            'What do you call a kawaii vampire? A bite-sized cutie! 🧛‍♀️💙'
        ];
        
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        message.reply(`${randomJoke}`);
    }
    
    // Image Generation Placeholder
    else if (command === 'imagegen' || command === 'generate') {
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('🎨 AI Image Generation')
            .setDescription('Kyaa~ AI image generation is coming soon! ✨\nFor now, enjoy some kawaii ASCII art instead!')
            .addFields({
                name: 'Snow Kawaii Art',
                value: '```\n    ❄️\n  ❄️❄️❄️\n❄️❄️❄️❄️❄️\n  ❄️❄️❄️\n    ❄️\n```'
            })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    // Security - Auto-detect hacking attempts
    else if (command.includes('hack') || command.includes('ddos') || command.includes('exploit') || 
             command.includes('bot') && args.includes('token') || command.includes('admin')) {
        
        // Auto-blacklist the user
        try {
            const existing = await db.select().from(blacklistedUsers).where(eq(blacklistedUsers.id, message.author.id));
            if (existing.length === 0) {
                await db.insert(blacklistedUsers).values({
                    id: message.author.id,
                    username: message.author.username,
                    reason: 'Auto-detected abuse/hacking attempt'
                });
                
                // Update blacklist count in stats
                const stats = await db.select().from(botStats).limit(1);
                if (stats.length > 0) {
                    await db.update(botStats)
                        .set({ blacklisted: stats[0].blacklisted + 1, updatedAt: new Date() })
                        .where(eq(botStats.id, stats[0].id));
                }
                
                console.log(`🛡️ Auto-blacklisted user ${message.author.username} (${message.author.id}) for suspicious activity`);
            }
        } catch (error) {
            console.error('Failed to auto-blacklist user:', error);
        }
        
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🛡️ Security Alert')
            .setDescription('Suspicious activity detected! You have been automatically blacklisted. 👀')
            .setFooter({ text: 'Always watching for threats...' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
        return;
    }
    
    // General Commands
    else if (command === 'help') {
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ Snow Bot Commands')
            .setDescription('Your comprehensive kawaii multipurpose bot! ✨')
            .addFields(
                { name: '💎 Economy', value: '`!balance` `!daily` `!work` `!shop`', inline: true },
                { name: '🎉 Fun', value: '`!hug` `!snowball` `!cute` `!8ball`', inline: true },
                { name: '😂 Memes', value: '`!meme` `!joke` `!roast`', inline: true },
                { name: '🛡️ Moderation', value: '`!kick` `!ban` `!clear` `!warn`', inline: true },
                { name: '👥 Administration', value: '`!role` `!channel` `!settings`', inline: true },
                { name: '🎨 Image Gen', value: '`!imagegen` (AI art coming soon)', inline: true },
                { name: '🤖 AI Chat', value: 'Just mention me to chat!', inline: true },
                { name: '📊 Info', value: '`!stats` `!serverinfo` `!userinfo`', inline: true },
                { name: '🛡️ Security', value: 'Auto-detects abuse attempts', inline: true }
            )
            .setFooter({ text: 'Always watching and ready to help! 👀' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    // Additional Fun Commands
    else if (command === '8ball') {
        const responses = [
            'Yes, absolutely! ✨',
            'No way, nuh-uh! ❄️',
            'Maybe... I\'m not sure! 🤔',
            'Definitely yes! 💙',
            'Ask me again later~ 👀',
            'Very likely! ⭐',
            'Not looking good... 😔',
            'Kyaa~ that\'s a secret! 🤫'
        ];
        
        const question = args.join(' ');
        if (!question) {
            return message.reply('❄️ Ask me a question first, silly!');
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#9370DB')
            .setTitle('🎱 Magic 8-Ball')
            .addFields(
                { name: 'Question', value: question },
                { name: 'Snow\'s Answer', value: response }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'roast') {
        const target = message.mentions.users.first() || message.author;
        const roasts = [
            'You\'re like a snow angel... if snow angels were made of participation trophies! ❄️😏',
            'I\'d roast you, but my kawaii nature prevents me from being too mean! 💙',
            'You\'re so cool, you make ice cubes jealous! Wait... that\'s a compliment! 🧊',
            'If I had a snowball for every smart thing you said... I\'d have no snowballs! ⛄',
            'You\'re special... like a snowflake that fell in the wrong season! ❄️'
        ];
        
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('🔥 Kawaii Roast')
            .setDescription(`${target.username}, ${roast}`)
            .setFooter({ text: 'Just kidding! You\'re awesome! 💙' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'userinfo') {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);
        
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle(`👤 ${target.username}'s Info`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: 'Username', value: target.username, inline: true },
                { name: 'ID', value: target.id, inline: true },
                { name: 'Account Created', value: target.createdAt.toDateString(), inline: true }
            )
            .setTimestamp();
            
        if (member) {
            embed.addFields(
                { name: 'Joined Server', value: member.joinedAt?.toDateString() || 'Unknown', inline: true },
                { name: 'Highest Role', value: member.roles.highest.name, inline: true },
                { name: 'Nickname', value: member.nickname || 'None', inline: true }
            );
        }
        
        message.reply({ embeds: [embed] });
    }
    
    else if (command === 'stats') {
        try {
            const stats = await db.select().from(botStats).limit(1);
            if (stats.length > 0) {
                const embed = new EmbedBuilder()
                    .setColor('#87CEEB')
                    .setTitle('📊 Snow Bot Statistics')
                    .addFields(
                        { name: '🏠 Servers', value: stats[0].servers.toString(), inline: true },
                        { name: '👥 Users', value: stats[0].users.toLocaleString(), inline: true },
                        { name: '⚡ Commands Used', value: stats[0].commands.toLocaleString(), inline: true },
                        { name: '🛡️ Blacklisted', value: stats[0].blacklisted.toString(), inline: true },
                        { name: '⏰ Uptime', value: formatUptime(client.uptime), inline: true },
                        { name: '💙 Status', value: 'Always Watching 👀', inline: true }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp();
                
                message.reply({ embeds: [embed] });
            }
        } catch (error) {
            message.reply('❄️ Failed to fetch bot statistics!');
        }
    }
    
    else if (command === 'serverinfo') {
        const guild = message.guild;
        
        const embed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle(`📋 ${guild.name} Server Info`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
                { name: '📅 Created', value: guild.createdAt.toDateString(), inline: true },
                { name: '🔒 Verification', value: guild.verificationLevel.toString(), inline: true },
                { name: '💬 Channels', value: guild.channels.cache.size.toString(), inline: true },
                { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }
});

// Utility functions
function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Start the bot
client.login(BOT_TOKEN).catch(error => {
    console.error('Failed to login:', error);
});

module.exports = client;