const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  const saltRounds = 10;
  return knex("users")
    .del() // TODO remove this line before final submission.
    .then(function () {
      return knex("users").insert([
        {
          userEmail: "admin@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Helios",
          lastName: "Management",
          role: "admin",
        },
        {
          userEmail: "user1@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Alice",
          lastName: "Wonderland",
          role: "voter",
        },
        {
          userEmail: "user2@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Bob",
          lastName: "Builder",
          role: "voter",
        },
        // {
        //   userEmail: "user3@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Charlie",
        //   lastName: "Sheen",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user4@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Dave",
        //   lastName: "Doe",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user5@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Elliot",
        //   lastName: "Doe",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user6@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Frank",
        //   lastName: "Doe",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user7@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Sarah",
        //   lastName: "Chua",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user8@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Jane",
        //   lastName: "Doe",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user9@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "John",
        //   lastName: "Doe",
        //   role: "voter",
        // },
        // {
        //   userEmail: "user10@email.com",
        //   hashedPassword: bcrypt.hashSync("password", saltRounds),
        //   publicKey: "",
        //   firstName: "Eric",
        //   lastName: "Dawson",
        //   role: "voter",
        // },
      ]);
    });
};
