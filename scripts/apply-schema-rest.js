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
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function executeSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function applySchema() {
  try {
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '../database/project_files_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Applying schema to Supabase...');
    
    // Better SQL parsing - handle multiline statements
    const statements = [];
    let currentStatement = '';
    let inFunction = false;
    let dollarQuoteCount = 0;
    
    const lines = schema.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments
      if (trimmedLine.startsWith('--') || trimmedLine === '') {
        continue;
      }
      
      // Track dollar quotes for functions
      if (trimmedLine.includes('$$')) {
        dollarQuoteCount++;
        if (dollarQuoteCount % 2 === 1) {
          inFunction = true;
        } else {
          inFunction = false;
        }
      }
      
      currentStatement += line + '\n';
      
      // End of statement
      if (trimmedLine.endsWith(';') && !inFunction) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n${i + 1}/${statements.length} Executing: ${statement.substring(0, 60).replace(/\n/g, ' ')}...`);
        
        const result = await executeSQL(statement);
        
        if (result.success) {
          console.log('✅ Success');
        } else {
          console.error('❌ Error:', result.error);
          // Don't fail completely on individual errors
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