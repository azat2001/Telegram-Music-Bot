const { playlists } = require('./storage');

const menuCommands = [
  { command: 'start', description: 'Показать справку' },
  { command: 'newplaylist', description: 'Создать плейлист' },
  { command: 'addtoplaylist', description: 'Добавить музыку' },
  { command: 'play', description: 'Воспроизвести плейлист' },
  { command: 'pause', description: 'Пауза' },
  { command: 'resume', description: 'Продолжить' },
  { command: 'skip', description: 'Следующий трек' },
  { command: 'list', description: 'Список плейлистов' },
  { command: 'songs', description: 'Треки в плейлисте' },
  { command: 'addchannel', description: 'Добавить канал' },
  { command: 'removechannel', description: 'Удалить канал' },
  { command: 'addgroup', description: 'Добавить группу' },
  { command: 'removegroup', description: 'Удалить группу' },
  { command: 'listchannels', description: 'Список каналов' },
  { command: 'listgroups', description: 'Список групп' }
];

async function setupMenuCommands(bot) {
  try {
    await bot.setMyCommands(menuCommands);
    console.log('✅ Команды меню настроены');
  } catch (error) {
    console.error('❌ Ошибка настройки команд меню:', error);
  }
}

module.exports = {
  menuCommands,
  setupMenuCommands
};