import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Extract database connection info from Supabase URL
const urlParts = supabaseUrl.replace('https://', '').split('.');
const projectRef = urlParts[0];

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || 'your_db_password', // You need to add this
  ssl: {
    rejectUnauthorized: false
  }
});

async function applySchema() {
  try {
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '../database/project_files_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Connecting to database...');
    await client.connect();
    
    console.log('🔧 Applying schema to Supabase...');
    
    // Execute the entire schema as one transaction
    try {
      await client.query('BEGIN');
      await client.query(schema);
      await client.query('COMMIT');
      console.log('✅ Schema applied successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error applying schema:', error.message);
      
      // Try executing statements individually
      console.log('🔄 Trying to execute statements individually...');
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            console.log(`${i + 1}/${statements.length} Executing: ${statement.substring(0, 60).replace(/\n/g, ' ')}...`);
            await client.query(statement);
            console.log('✅ Success');
          } catch (stmtError) {
            console.error('❌ Error:', stmtError.message);
          }
        }
      }
    }
    
    console.log('\n🎉 Schema application completed!');
    console.log('💡 Run "node scripts/check-schema.js" to verify');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('💡 You need to add SUPABASE_DB_PASSWORD to your .env.local file');
    console.error('💡 Or use the Supabase Dashboard SQL Editor instead');
  } finally {
    await client.end();
  }
}

applySchema();