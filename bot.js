const TelegramBot = require('node-telegram-bot-api');
const config = require('./src/config');
const commands = require('./src/commands');
const handleAudio = require('./src/audioHandler');
const { setupMenuCommands } = require('./src/menuCommands');

// Initialize bot
const bot = new TelegramBot(config.token, { polling: true });

// Setup menu commands
setupMenuCommands(bot);

// Register commands
Object.values(commands).forEach(command => command(bot));

// Register audio handler
handleAudio(bot);

console.log('🎵 Музыкальный бот запущен и готов к работе!');