const { playlists } = require('./storage');

class Player {
  constructor() {
    this.currentPlaylist = new Map(); // chatId -> { songs: [], currentIndex: 0, isPlaying: false }
  }

  startPlaylist(bot, chatId, playlistName) {
    const userPlaylists = playlists.get(chatId);
    if (!userPlaylists || !userPlaylists.has(playlistName)) {
      bot.sendMessage(chatId, '❌ Плейлист не найден');
      return;
    }

    const songs = userPlaylists.get(playlistName);
    if (songs.length === 0) {
      bot.sendMessage(chatId, '❌ Плейлист пуст');
      return;
    }

    this.currentPlaylist.set(chatId, {
      songs,
      currentIndex: 0,
      isPlaying: true,
      playlistName
    });

    this.playCurrentSong(bot, chatId);
  }

  async playCurrentSong(bot, chatId) {
    const playlist = this.currentPlaylist.get(chatId);
    if (!playlist || !playlist.isPlaying) return;

    const song = playlist.songs[playlist.currentIndex];
    try {
      await bot.sendAudio(chatId, song.path, {
        caption: `▶️ Играет: ${song.name}\nПлейлист: ${playlist.playlistName}\n${playlist.currentIndex + 1}/${playlist.songs.length}`
      });
    } catch (error) {
      bot.sendMessage(chatId, '❌ Ошибка воспроизведения файла');
      console.error(error);
    }
  }

  pause(bot, chatId) {
    const playlist = this.currentPlaylist.get(chatId);
    if (!playlist) {
      bot.sendMessage(chatId, '❌ Нет активного воспроизведения');
      return;
    }
    playlist.isPlaying = false;
    bot.sendMessage(chatId, '⏸ Воспроизведение приостановлено');
  }

  resume(bot, chatId) {
    const playlist = this.currentPlaylist.get(chatId);
    if (!playlist) {
      bot.sendMessage(chatId, '❌ Нет активного воспроизведения');
      return;
    }
    playlist.isPlaying = true;
    bot.sendMessage(chatId, '▶️ Воспроизведение возобновлено');
    this.playCurrentSong(bot, chatId);
  }

  skip(bot, chatId) {
    const playlist = this.currentPlaylist.get(chatId);
    if (!playlist) {
      bot.sendMessage(chatId, '❌ Нет активного воспроизведения');
      return;
    }

    playlist.currentIndex++;
    if (playlist.currentIndex >= playlist.songs.length) {
      playlist.currentIndex = 0;
    }

    bot.sendMessage(chatId, '⏭ Переход к следующему треку');
    if (playlist.isPlaying) {
      this.playCurrentSong(bot, chatId);
    }
  }
}

module.exports = new Player();