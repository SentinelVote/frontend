exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("userEmail").notNullable().unique();
    table.string("hashedPassword").notNullable();
    table.string("publicKey").notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("role").notNullable().defaultTo("voter");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
