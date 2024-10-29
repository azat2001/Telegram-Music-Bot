const { playlists, userStates } = require('./storage');
const player = require('./player');
const channelManager = require('./channelManager');

const commands = {
  start: (bot) => {
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 
        'Добро пожаловать в Музыкальный Бот! 🎵\n\n' +
        'Доступные команды:\n' +
        '📋 Управление плейлистами:\n' +
        '/newplaylist [название] - Создать новый плейлист\n' +
        '/addtoplaylist [плейлист] - Добавить музыку в плейлист\n' +
        '/play [плейлист] - Воспроизвести плейлист\n' +
        '/pause - Приостановить воспроизведение\n' +
        '/resume - Возобновить воспроизведение\n' +
        '/skip - Пропустить текущий трек\n' +
        '/list - Показать плейлисты\n' +
        '/songs [плейлист] - Показать треки в плейлисте\n\n' +
        '📢 Управление каналами и группами:\n' +
        '/addchannel [ID] - Добавить канал\n' +
        '/removechannel [ID] - Удалить канал\n' +
        '/addgroup [ID] - Добавить группу\n' +
        '/removegroup [ID] - Удалить группу\n' +
        '/listchannels - Список каналов\n' +
        '/listgroups - Список групп'
      );
    });
  },

  // Existing playlist commands...
  newPlaylist: (bot) => {
    bot.onText(/\/newplaylist (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const playlistName = match[1];
      
      if (!playlists.has(chatId)) {
        playlists.set(chatId, new Map());
      }
      
      const userPlaylists = playlists.get(chatId);
      if (userPlaylists.has(playlistName)) {
        bot.sendMessage(chatId, '❌ Плейлист уже существует!');
        return;
      }
      
      userPlaylists.set(playlistName, []);
      bot.sendMessage(chatId, `✅ Плейлист "${playlistName}" создан!`);
    });
  },

  addToPlaylist: (bot) => {
    bot.onText(/\/addtoplaylist (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const playlistName = match[1];
      
      if (!playlists.has(chatId) || !playlists.get(chatId).has(playlistName)) {
        bot.sendMessage(chatId, '❌ Плейлист не найден!');
        return;
      }
      
      userStates.set(chatId, {
        action: 'adding_music',
        playlist: playlistName
      });
      
      bot.sendMessage(chatId, '📤 Отправьте мне аудиофайлы для добавления в плейлист. Отправьте /done когда закончите.');
    });
  },

  play: (bot) => {
    bot.onText(/\/play (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const playlistName = match[1];
      player.startPlaylist(bot, chatId, playlistName);
    });
  },

  pause: (bot) => {
    bot.onText(/\/pause/, (msg) => {
      const chatId = msg.chat.id;
      player.pause(bot, chatId);
    });
  },

  resume: (bot) => {
    bot.onText(/\/resume/, (msg) => {
      const chatId = msg.chat.id;
      player.resume(bot, chatId);
    });
  },

  skip: (bot) => {
    bot.onText(/\/skip/, (msg) => {
      const chatId = msg.chat.id;
      player.skip(bot, chatId);
    });
  },

  done: (bot) => {
    bot.onText(/\/done/, (msg) => {
      const chatId = msg.chat.id;
      if (userStates.has(chatId)) {
        userStates.delete(chatId);
        bot.sendMessage(chatId, '✅ Загрузка музыки завершена.');
      }
    });
  },

  list: (bot) => {
    bot.onText(/\/list/, (msg) => {
      const chatId = msg.chat.id;
      const userPlaylists = playlists.get(chatId);
      
      if (!userPlaylists || userPlaylists.size === 0) {
        bot.sendMessage(chatId, '❌ Плейлисты не найдены.');
        return;
      }
      
      const playlistNames = Array.from(userPlaylists.keys());
      bot.sendMessage(chatId, '📋 Ваши плейлисты:\n' + playlistNames.map(name => `• ${name}`).join('\n'));
    });
  },

  songs: (bot) => {
    bot.onText(/\/songs (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const playlistName = match[1];
      const userPlaylists = playlists.get(chatId);
      
      if (!userPlaylists || !userPlaylists.has(playlistName)) {
        bot.sendMessage(chatId, '❌ Плейлист не найден.');
        return;
      }
      
      const songs = userPlaylists.get(playlistName);
      if (songs.length === 0) {
        bot.sendMessage(chatId, '❌ Плейлист пуст.');
        return;
      }
      
      const songList = songs.map((song, index) => `${index + 1}. 🎵 ${song.name}`).join('\n');
      bot.sendMessage(chatId, `📋 Треки в плейлисте "${playlistName}":\n${songList}`);
    });
  },

  // New channel and group commands
  addChannel: (bot) => {
    bot.onText(/\/addchannel (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const channelId = match[1];
      channelManager.addChannel(bot, chatId, channelId);
    });
  },

  removeChannel: (bot) => {
    bot.onText(/\/removechannel (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const channelId = match[1];
      channelManager.removeChannel(bot, chatId, channelId);
    });
  },

  addGroup: (bot) => {
    bot.onText(/\/addgroup (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const groupId = match[1];
      channelManager.addGroup(bot, chatId, groupId);
    });
  },

  removeGroup: (bot) => {
    bot.onText(/\/removegroup (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const groupId = match[1];
      channelManager.removeGroup(bot, chatId, groupId);
    });
  },

  listChannels: (bot) => {
    bot.onText(/\/listchannels/, (msg) => {
      const chatId = msg.chat.id;
      channelManager.listChannels(bot, chatId);
    });
  },

  listGroups: (bot) => {
    bot.onText(/\/listgroups/, (msg) => {
      const chatId = msg.chat.id;
      channelManager.listGroups(bot, chatId);
    });
  }
};

module.exports = commands;