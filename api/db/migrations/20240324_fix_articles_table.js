export async function up(knex) {
  // Drop existing articles table if it exists
  await knex.schema.dropTableIfExists('articles');

  // Create articles table with proper schema
  await knex.schema.createTable('articles', table => {
    table.string('id').primary();
    table.string('title').notNullable();
    table.text('preview');
    table.text('content').notNullable();
    table.string('image_url');
    table.string('author_id').notNullable();
    table.integer('views').defaultTo(0);
    table.json('tags');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('status').defaultTo('draft');
    table.timestamp('published_at').nullable();
    table.string('institution_id').nullable();
    table.string('psychologist_id').nullable();

    // Add foreign key constraints
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('institution_id').references('id').inTable('institutions').onDelete('SET NULL');
    table.foreign('psychologist_id').references('id').inTable('psychologists').onDelete('SET NULL');
  });

  // Add indexes
  await knex.schema.alterTable('articles', table => {
    table.index('author_id');
    table.index('institution_id');
    table.index('psychologist_id');
    table.index('status');
    table.index('published_at');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('articles');
}