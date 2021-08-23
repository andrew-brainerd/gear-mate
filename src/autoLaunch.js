const AutoLaunch = require('auto-launch');

const autoLaunchApplication = () => {
  const raidLockerAutoLauncher = new AutoLaunch({ name: 'Gear Mate' });
  raidLockerAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
