const git = require('nodegit');

const baseUrl = 'http://github.com/andrew-brainerd';

const downloadRepo = (repoName, downloadDir) => {
  return new Promise(resolve => {
    git.Clone(`${baseUrl}/${repoName}`, downloadDir).then(() => {
      resolve({});
    });
  });
};

module.exports = {
  downloadRepo
};
