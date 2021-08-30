const { Notification } = require('electron');
const getAppIcon = require('../../getAppIcon');

const showNotification = (message, title = APP_NAME) => {
  new Notification({
    title,
    body: message,
    icon: getAppIcon()
  }).show();
};

module.exports = {
  showNotification
};
