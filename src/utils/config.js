var path = require('path');

const config = {
  uploadDir: path.join(__dirname, '..', '..', 'uploads'),
  username: 'ariauser',
  password: 'P@ssw0rd!99',
};

console.log(config.uploadDir);

export default config;
