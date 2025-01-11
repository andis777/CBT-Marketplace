export async function up(knex) {
  // Create promotions table
  await knex.schema.createTable('promotions', table => {
    table.string('id', 36).primary();
    table.enum('type', ['psychologist', 'institution']).notNullable();
    table.string('entity_id', 36).notNullable();
    table.string('payment_id').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Add top status fields to psychologists
  await knex.raw(`
    SELECT COUNT(*) INTO @exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE()
    AND table_name = 'psychologists'
    AND column_name = 'is_top';

    SET @query = IF(@exists = 0,
      'ALTER TABLE psychologists ADD COLUMN is_top BOOLEAN DEFAULT false',
      'SELECT 1'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SELECT COUNT(*) INTO @exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE()
    AND table_name = 'psychologists'
    AND column_name = 'top_until';

    SET @query = IF(@exists = 0,
      'ALTER TABLE psychologists ADD COLUMN top_until TIMESTAMP NULL',
      'SELECT 1'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  `);

  // Add top status fields to institutions
  await knex.raw(`
    SELECT COUNT(*) INTO @exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE()
    AND table_name = 'institutions'
    AND column_name = 'is_top';

    SET @query = IF(@exists = 0,
      'ALTER TABLE institutions ADD COLUMN is_top BOOLEAN DEFAULT false',
      'SELECT 1'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SELECT COUNT(*) INTO @exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE()
    AND table_name = 'institutions'
    AND column_name = 'top_until';

    SET @query = IF(@exists = 0,
      'ALTER TABLE institutions ADD COLUMN top_until TIMESTAMP NULL',
      'SELECT 1'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  `);

  // Add indexes
  await knex.schema.alterTable('promotions', table => {
    table.index('payment_id');
    table.index('entity_id');
    table.index('status');
  });
}

export async function down(knex) {
  // Drop indexes
  await knex.schema.alterTable('promotions', table => {
    table.dropIndex('payment_id');
    table.dropIndex('entity_id');
    table.dropIndex('status');
  });

  // Drop top status fields from institutions
  await knex.raw(`
    ALTER TABLE institutions 
    DROP COLUMN IF EXISTS is_top,
    DROP COLUMN IF EXISTS top_until
  `);

  // Drop top status fields from psychologists
  await knex.raw(`
    ALTER TABLE psychologists 
    DROP COLUMN IF EXISTS is_top,
    DROP COLUMN IF EXISTS top_until
  `);

  // Drop promotions table
  await knex.schema.dropTable('promotions');
}