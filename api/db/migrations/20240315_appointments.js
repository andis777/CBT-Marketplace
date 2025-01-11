export async function up(knex) {
  // Create appointments table
  await knex.schema.createTable('appointments', table => {
    table.string('id').primary();
    table.string('client_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('psychologist_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('service_id').notNullable();
    table.datetime('appointment_date').notNullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled', 'completed']).defaultTo('pending');
    table.text('notes');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('appointments');
}