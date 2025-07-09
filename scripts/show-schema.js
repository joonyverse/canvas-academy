import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function showSchema() {
  try {
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '../database/project_files_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Copy the following SQL and paste it into Supabase Dashboard > SQL Editor:');
    console.log('═'.repeat(80));
    console.log(schema);
    console.log('═'.repeat(80));
    console.log('\n💡 Instructions:');
    console.log('1. Go to https://app.supabase.com/');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste the above SQL');
    console.log('5. Click "Run"');
    console.log('\n🔍 After applying, verify with: node scripts/check-schema.js');
    
  } catch (error) {
    console.error('❌ Error reading schema:', error);
  }
}

showSchema();