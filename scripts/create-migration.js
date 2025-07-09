import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createMigration() {
  try {
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '../database/project_files_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Create migrations directory if it doesn't exist
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    
    // Create migration file with timestamp
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const migrationFile = path.join(migrationsDir, `${timestamp}_create_project_files.sql`);
    
    console.log('📝 Creating migration file...');
    fs.writeFileSync(migrationFile, schema);
    
    console.log('✅ Migration file created:', migrationFile);
    console.log('\n🔧 To apply the migration, run:');
    console.log('supabase db push');
    console.log('\n💡 Or copy the schema to Supabase Dashboard SQL Editor');
    
  } catch (error) {
    console.error('❌ Error creating migration:', error);
  }
}

createMigration();