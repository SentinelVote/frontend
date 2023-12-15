const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  const saltRounds = 10;
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          userEmail: "user1@email.com",
          hashedPassword: bcrypt.hashSync("password1", saltRounds),
          publicKey: "publickey1",
          firstName: "John",
          lastName: "Doe",
          role: "voter",
        },
        {
          userEmail: "user2@email.com",
          hashedPassword: bcrypt.hashSync("password2", saltRounds),
          publicKey: "publickey2",
          firstName: "Jane",
          lastName: "Doe",
          role: "admin",
        },
      ]);
    });
};
