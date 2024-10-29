const path = require('path');
const fs = require('fs');
const { playlists, userStates } = require('./storage');
const config = require('./config');

function handleAudio(bot) {
  bot.on('audio', async (msg) => {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);
    
    if (state && state.action === 'adding_music') {
      const file = msg.audio;
      const fileName = file.file_name || `${file.file_id}.mp3`;
      const filePath = path.join(config.musicDir, fileName);
      
      try {
        const fileStream = bot.getFileStream(file.file_id);
        const writeStream = fs.createWriteStream(filePath);
        fileStream.pipe(writeStream);
        
        writeStream.on('finish', () => {
          const playlist = playlists.get(chatId).get(state.playlist);
          playlist.push({
            name: fileName,
            path: filePath
          });
          bot.sendMessage(chatId, `✅ Трек "${fileName}" добавлен в плейлист "${state.playlist}"`);
        });
      } catch (error) {
        bot.sendMessage(chatId, '❌ Ошибка сохранения аудиофайла.');
        console.error(error);
      }
    }
  });
}

module.exports = handleAudio;