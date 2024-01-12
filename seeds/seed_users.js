const bcrypt = require("bcrypt");
exports.seed = function (knex) {
  const saltRounds = 10;
  return knex("users")
    .del() // TODO remove this line before final submission.
    .then(function () {
      return knex("users").insert([
        {
          email: "admin@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Helios",
          lastName: "N/A",
          constituency: "N/A",
          role: "admin",
        },
        {
          email: "user1@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey:
            "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEuAVrt8Zwva6Rf7TtnvRY48KP/5zV\nEC7Xi15UQfUZZKHt/WfSfRufGFAN9WP4+SBqn2pn2K8zOdAGK55A4mbQAA==\n-----END PUBLIC KEY-----\n",
          firstName: "Alice",
          lastName: "Cooper",
          constituency: "West Coast", // Based on registered home address GRC in Singapore.
          role: "voter",
        },
        {
          email: "user2@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey:
            "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBfKErOt6wsinf7Poy6PpYZ7UVXSC\nMmGFV51CkMkC4qg987bGjbAFxOJFXpFMcFlR7BQJ3GvMOqotvECd6YweLA==\n-----END PUBLIC KEY-----",
          firstName: "Bob",
          lastName: "Dylan",
          constituency: "Marine Parade",
          role: "voter",
        },
        {
          email: "user3@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey:
            "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIN8Q67zFSoh3k8o2Q6JL2zcIkvjk\nz1ifQ55A9+OR+bBHIcsY8wrT7T8O7IpHfYQ/2qJVsoGCxTHF+0moC/8Jdg==\n-----END PUBLIC KEY-----",
          firstName: "Charlie",
          lastName: "Sheen",
          constituency: "Bishan-Toa Payoh",
          role: "voter",
        },
        {
          email: "user4@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Dave",
          lastName: "Doe",
          constituency: "Marine Parade",
          role: "voter",
        },
        {
          email: "user5@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Elliot",
          lastName: "Doe",
          constituency: "Bishan-Toa Payoh",
          role: "voter",
        },
        {
          email: "user6@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Frank",
          lastName: "Doe",
          constituency: "Hougang",
          role: "voter",
        },
        {
          email: "user7@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Sarah",
          lastName: "Chua",
          constituency: "East Coast",
          role: "voter",
        },
        {
          email: "user8@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Jane",
          lastName: "Doe",
          constituency: "MacPherson",
          role: "voter",
        },
        {
          email: "user9@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "John",
          lastName: "Doe",
          constituency: "Potong Pasir",
          role: "voter",
        },
        {
          email: "user10@email.com",
          password: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Eric",
          lastName: "Dawson",
          constituency: "Yio Chu Kang",
          role: "voter",
        },
      ]);
    });
};
