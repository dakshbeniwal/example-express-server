'use strict';

export default {
  up: async (queryInterface) => await queryInterface.bulkInsert('adminUsers', [{
    firstName: 'System',
    lastName: 'User',
    email: 'systemuser@yopmail.com',
    password: "$2b$10$gFNEQ3SgxY5/wbg7qwCumOcMubnzx/rpBo7sg1QjA8EhVWJhggple", // nhibtata
    phone: "1234567890"
  }]),
  down: async (queryInterface) => await queryInterface.bulkDelete('adminUsers', null, {}),
};
