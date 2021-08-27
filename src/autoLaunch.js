const AutoLaunch = require('auto-launch');

const autoLaunchApplication = () => {
  const raidLockerAutoLauncher = new AutoLaunch({ name: '<Tentative> GuildMate' });
  raidLockerAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
