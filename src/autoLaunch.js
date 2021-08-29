const AutoLaunch = require('auto-launch');
const { APP_NAME } = require('./constants');

const autoLaunchApplication = () => {
  const GuildMateAutoLauncher = new AutoLaunch({ name: APP_NAME });
  GuildMateAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
