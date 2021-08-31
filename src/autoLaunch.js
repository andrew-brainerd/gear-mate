const AutoLaunch = require('auto-launch');

const autoLaunchApplication = appName => {
  const GuildMateAutoLauncher = new AutoLaunch({ name: appName });
  GuildMateAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
