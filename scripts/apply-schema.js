import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('- SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅' : '❌');
  console.error('\n💡 Please add SUPABASE_SERVICE_KEY to your .env.local file');
  console.error('You can find this in your Supabase project settings under API > service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    // Try alternative method using direct query
    try {
      const { data, error: queryError } = await supabase.from('_sql').select('*').eq('query', sql);
      if (queryError) throw queryError;
      return { success: true, data };
    } catch (queryError) {
      return { success: false, error: error.message || error };
    }
  }
}

async function applySchema() {
  try {
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '../database/project_files_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Applying schema to Supabase...');
    console.log('URL:', supabaseUrl);
    
    // Split schema into statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .map(s => s + ';');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n${i + 1}/${statements.length} Executing: ${statement.substring(0, 60)}...`);
        
        const result = await executeSQL(statement);
        
        if (result.success) {
          console.log('✅ Success');
        } else {
          console.error('❌ Error:', result.error);
          console.error('Statement:', statement);
        }
      }
    }
    
    console.log('\n🎉 Schema application completed!');
    console.log('💡 Run "node scripts/check-schema.js" to verify');
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    process.exit(1);
  }
}

applySchema();