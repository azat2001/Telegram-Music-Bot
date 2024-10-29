# Telegram Music Bot

A simple Telegram bot for managing music playlists and playback.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Replace 'YOUR_BOT_TOKEN' in bot.js with your Telegram bot token from @BotFather

3. Run the bot:
```bash
npm start
```

## Features

- Create and manage multiple playlists
- Add music files to playlists
- Play/pause/skip functionality
- List all playlists and songs

## Commands

- /start - Show help message
- /newplaylist [name] - Create new playlist
- /addtoplaylist [playlist] - Add music to playlist
- /play [playlist] - Play playlist
- /pause - Pause playback
- /resume - Resume playback
- /skip - Skip current track
- /list - Show playlists
- /songs [playlist] - Show songs in playlist