const AutoLaunch = require('auto-launch');

const autoLaunchApplication = () => {
  const GuildMateAutoLauncher = new AutoLaunch({ name: '<Tentative> GuildMate' });
  GuildMateAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
