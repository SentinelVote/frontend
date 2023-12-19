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
          lastName: "N/A",
          region: "N/A",
          role: "admin",
        },
        {
          userEmail: "user1@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey:
            "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEuAVrt8Zwva6Rf7TtnvRY48KP/5zV\nEC7Xi15UQfUZZKHt/WfSfRufGFAN9WP4+SBqn2pn2K8zOdAGK55A4mbQAA==\n-----END PUBLIC KEY-----\n",
          firstName: "Alice",
          lastName: "Cooper",
          region: "West Coast", // Based on registered home address GRC in Singapore.
          role: "voter",
        },
        {
          userEmail: "user2@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: 
              "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBfKErOt6wsinf7Poy6PpYZ7UVXSC\nMmGFV51CkMkC4qg987bGjbAFxOJFXpFMcFlR7BQJ3GvMOqotvECd6YweLA==\n-----END PUBLIC KEY-----",
          firstName: "Bob",
          lastName: "Dylan",
          region: "Marine Parade",
          role: "voter",
        },
        {
          userEmail: "user3@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: 
              "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIN8Q67zFSoh3k8o2Q6JL2zcIkvjk\nz1ifQ55A9+OR+bBHIcsY8wrT7T8O7IpHfYQ/2qJVsoGCxTHF+0moC/8Jdg==\n-----END PUBLIC KEY-----",
          firstName: "Charlie",
          lastName: "Sheen",
          region: "Bishan-Toa Payoh",
          role: "voter",
        },
        {
          userEmail: "user4@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Dave",
          lastName: "Doe",
          region: "Marine Parade",
          role: "voter",
        },
        {
          userEmail: "user5@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Elliot",
          lastName: "Doe",
          region: "Bishan-Toa Payoh",
          role: "voter",
        },
        {
          userEmail: "user6@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Frank",
          lastName: "Doe",
          region: "Hougang",
          role: "voter",
        },
        {
          userEmail: "user7@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Sarah",
          lastName: "Chua",
          region: "East Coast",
          role: "voter",
        },
        {
          userEmail: "user8@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Jane",
          lastName: "Doe",
          region: "MacPherson",
          role: "voter",
        },
        {
          userEmail: "user9@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "John",
          lastName: "Doe",
          region: "Potong Pasir",
          role: "voter",
        },
        {
          userEmail: "user10@email.com",
          hashedPassword: bcrypt.hashSync("password", saltRounds),
          publicKey: "",
          firstName: "Eric",
          lastName: "Dawson",
          region: "Yio Chu Kang",
          role: "voter",
        },
      ]);
    });
};
