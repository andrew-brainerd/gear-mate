const unhandled = require('electron-unhandled');
const { openNewGitHubIssue, debugInfo } = require('electron-util');

const handleErrors = () => {
  unhandled({
    reportButton: error => {
      openNewGitHubIssue({
        user: 'andrew-brainerd',
        repo: 'tentative-guild-mate',
        body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
      });
    }
  });
};

module.exports = {
  handleErrors
}
