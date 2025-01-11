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
  // Create clients table
  await knex.schema.createTable('clients', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.json('preferences');
    table.json('saved_psychologists');
    table.json('saved_institutions');
    table.timestamps(true, true);
  });

  // Create programs table
  await knex.schema.createTable('programs', table => {
    table.string('id').primary();
    table.string('institution_id').references('id').inTable('institutions').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.integer('duration_months');
    table.decimal('price', 10, 2);
    table.timestamps(true, true);
  });

  // Create students table
  await knex.schema.createTable('students', table => {
    table.string('id').primary();
    table.string('program_id').references('id').inTable('programs').onDelete('CASCADE');
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['active', 'completed', 'dropped']).defaultTo('active');
    table.date('enrollment_date').notNullable();
    table.date('completion_date');
    table.timestamps(true, true);
  });

  // Create activity_log table
  await knex.schema.createTable('activity_log', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('action_type').notNullable();
    table.json('action_details');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Create notifications table
  await knex.schema.createTable('notifications', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable();
    table.string('title').notNullable();
    table.text('message');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // Drop existing tables if they exist
  await knex.schema.dropTableIfExists('articles');
  await knex.schema.dropTableIfExists('certificates');
  await knex.schema.dropTableIfExists('languages');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('appointments');
  await knex.schema.dropTableIfExists('favorites');
  await knex.schema.dropTableIfExists('psy_profiles');
  await knex.schema.dropTableIfExists('institutes');
  await knex.schema.dropTableIfExists('users');

  // Create users table
  await knex.schema.createTable('users', table => {
    table.string('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.string('role').notNullable();
    table.string('avatar_url');
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  });

  // Create institutes table
  await knex.schema.createTable('institutes', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.string('address');
    table.json('contacts');
    table.boolean('is_verified').defaultTo(false);
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  });

  // Create psychologist profiles table
  await knex.schema.createTable('psy_profiles', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('description');
    table.text('education');
    table.float('rating').defaultTo(0);
    table.integer('reviews_count').defaultTo(0);
    table.json('specializations');
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  });

  // Create certificates table
  await knex.schema.createTable('certificates', table => {
    table.string('id').primary();
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('issuer');
    table.date('issue_date');
    table.string('image_url');
    table.timestamps(true, true);
  });

  // Create languages table
  await knex.schema.createTable('languages', table => {
    table.string('id').primary();
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.string('language').notNullable();
    table.string('level');
    table.timestamps(true, true);
  });

  // Create services table
  await knex.schema.createTable('services', table => {
    table.string('id').primary();
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 10, 2);
    table.integer('duration_minutes');
    table.timestamps(true, true);
  });

  // Create appointments table
  await knex.schema.createTable('appointments', table => {
    table.string('id').primary();
    table.string('client_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.string('service_id').references('id').inTable('services').onDelete('CASCADE');
    table.datetime('appointment_date').notNullable();
    table.string('status').defaultTo('pending');
    table.text('notes');
    table.timestamps(true, true);
  });

  // Create reviews table
  await knex.schema.createTable('reviews', table => {
    table.string('id').primary();
    table.string('author_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.integer('rating').notNullable();
    table.text('comment');
    table.text('reply');
    table.timestamps(true, true);
  });

  // Create favorites table
  await knex.schema.createTable('favorites', table => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('psychologist_id').references('id').inTable('psy_profiles').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id', 'psychologist_id']);
  });

  // Create articles table
  await knex.schema.createTable('articles', table => {
    table.string('id').primary();
    table.string('author_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.string('image_url');
    table.json('tags');
    table.integer('views').defaultTo(0);
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('articles');
  await knex.schema.dropTableIfExists('favorites');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('appointments');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('languages');
  await knex.schema.dropTableIfExists('certificates');
  await knex.schema.dropTableIfExists('psy_profiles');
  await knex.schema.dropTableIfExists('institutes');
  await knex.schema.dropTableIfExists('users');
}