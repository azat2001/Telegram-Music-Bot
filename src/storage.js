const fs = require('fs');
const config = require('./config');

// Create music directory if it doesn't exist
if (!fs.existsSync(config.musicDir)) {
  fs.mkdirSync(config.musicDir);
}

// In-memory storage
const playlists = new Map();
const userStates = new Map();
const channels = new Map(); // chatId -> Set of channel IDs
const groups = new Map();   // chatId -> Set of group IDs

module.exports = {
  playlists,
  userStates,
  channels,
  groups
};