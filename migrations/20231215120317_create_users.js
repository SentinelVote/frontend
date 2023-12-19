exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("userEmail").notNullable().unique();
      table.string("hashedPassword").notNullable();
      table.string("publicKey").notNullable();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("region").notNullable();
      table.string("role").notNullable().defaultTo("voter");
    })
    .then(
      // This table has only one row, and one field.
      knex.schema.createTable("foldedPublicKeys", (table) => {
        table.string("foldedPublicKeys").defaultTo("").primary();
      })
    );

  // table
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
