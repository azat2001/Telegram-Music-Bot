const { channels, groups } = require('./storage');

class ChannelManager {
  constructor() {
    this.commands = [
      { command: 'addchannel', description: 'Добавить канал' },
      { command: 'removechannel', description: 'Удалить канал' },
      { command: 'addgroup', description: 'Добавить группу' },
      { command: 'removegroup', description: 'Удалить группу' },
      { command: 'listchannels', description: 'Список каналов' },
      { command: 'listgroups', description: 'Список групп' }
    ];
  }

  async setupCommands(bot) {
    try {
      await bot.setMyCommands(this.commands);
      console.log('Команды меню успешно настроены');
    } catch (error) {
      console.error('Ошибка настройки команд меню:', error);
    }
  }

  addChannel(bot, chatId, channelId) {
    if (!channels.has(chatId)) {
      channels.set(chatId, new Set());
    }
    
    const userChannels = channels.get(chatId);
    if (userChannels.has(channelId)) {
      bot.sendMessage(chatId, '❌ Этот канал уже добавлен');
      return;
    }

    userChannels.add(channelId);
    bot.sendMessage(chatId, '✅ Канал успешно добавлен');
  }

  removeChannel(bot, chatId, channelId) {
    const userChannels = channels.get(chatId);
    if (!userChannels || !userChannels.has(channelId)) {
      bot.sendMessage(chatId, '❌ Канал не найден');
      return;
    }

    userChannels.delete(channelId);
    bot.sendMessage(chatId, '✅ Канал удален');
  }

  addGroup(bot, chatId, groupId) {
    if (!groups.has(chatId)) {
      groups.set(chatId, new Set());
    }
    
    const userGroups = groups.get(chatId);
    if (userGroups.has(groupId)) {
      bot.sendMessage(chatId, '❌ Эта группа уже добавлена');
      return;
    }

    userGroups.add(groupId);
    bot.sendMessage(chatId, '✅ Группа успешно добавлена');
  }

  removeGroup(bot, chatId, groupId) {
    const userGroups = groups.get(chatId);
    if (!userGroups || !userGroups.has(groupId)) {
      bot.sendMessage(chatId, '❌ Группа не найдена');
      return;
    }

    userGroups.delete(groupId);
    bot.sendMessage(chatId, '✅ Группа удалена');
  }

  listChannels(bot, chatId) {
    const userChannels = channels.get(chatId);
    if (!userChannels || userChannels.size === 0) {
      bot.sendMessage(chatId, '📢 У вас нет добавленных каналов');
      return;
    }

    const channelList = Array.from(userChannels).map(id => `• ${id}`).join('\n');
    bot.sendMessage(chatId, `📢 Ваши каналы:\n${channelList}`);
  }

  listGroups(bot, chatId) {
    const userGroups = groups.get(chatId);
    if (!userGroups || userGroups.size === 0) {
      bot.sendMessage(chatId, '👥 У вас нет добавленных групп');
      return;
    }

    const groupList = Array.from(userGroups).map(id => `• ${id}`).join('\n');
    bot.sendMessage(chatId, `👥 Ваши группы:\n${groupList}`);
  }
}

module.exports = new ChannelManager();