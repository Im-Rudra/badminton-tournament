const authSchema = {
  Administrator: ['Administrator'],
  Moderator: ['Administrator', 'Moderator'],
  User: ['Administrator', 'Moderator', 'User']
};

module.exports = authSchema;
