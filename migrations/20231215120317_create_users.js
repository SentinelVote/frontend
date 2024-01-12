exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.string("publicKey").notNullable();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("constituency").notNullable();
      table.string("role").notNullable().defaultTo("voter");
    })
    .createTable("foldedPublicKeys", (table) => {
      table.increments("id").primary();
      table.string("foldedPublicKeys").notNullable();
      table.integer("singleton").notNullable().defaultTo(1).unique(); // Can only be one row in this table.
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("foldedPublicKeys");
};
