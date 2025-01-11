export async function up(knex) {
  // First drop existing foreign key constraints if they exist
  await knex.schema.table('articles', table => {
    table.dropForeign(['institution_id']);
    table.dropForeign(['psychologist_id']);
  });

  // Modify columns
  await knex.schema.alterTable('articles', table => {
    table.string('status').defaultTo('draft').alter();
    table.timestamp('published_at').nullable().alter();
    table.string('institution_id').nullable().alter();
    table.string('psychologist_id').nullable().alter();
  });

  // Re-add foreign key constraints
  await knex.schema.alterTable('articles', table => {
    table.foreign('institution_id').references('id').inTable('institutions').onDelete('SET NULL');
    table.foreign('psychologist_id').references('id').inTable('psychologists').onDelete('SET NULL');
  });
}

export async function down(knex) {
  await knex.schema.table('articles', table => {
    table.dropForeign(['institution_id']);
    table.dropForeign(['psychologist_id']);
  });
}