module.exports = {
  commands: [
    {
      name: 'with-oss-notice',
      description: 'Set up all native boilerplate for OSS licenses notice',
      func: ([], { project: { android, ios }}, {}) => {
        const withOSSNotice = require('./bare-plugin/build').default;

        withOSSNotice(android.sourceDir, ios.sourceDir);
      },
    },
  ],
};