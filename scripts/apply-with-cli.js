import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

dotenv.config({ path: '.env.local' });

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const dbPassword = process.env.PGPASSWORD;

if (!accessToken || !dbPassword) {
  console.error('❌ Missing required environment variables:');
  console.error('- SUPABASE_ACCESS_TOKEN:', accessToken ? '✅' : '❌');
  console.error('- PGPASSWORD:', dbPassword ? '✅' : '❌');
  process.exit(1);
}

async function applySchema() {
  try {
    console.log('🔧 Setting up environment...');
    
    // Set environment variables for supabase CLI
    process.env.SUPABASE_ACCESS_TOKEN = accessToken;
    process.env.PGPASSWORD = dbPassword;
    
    console.log('🔗 Ensuring project is linked...');
    try {
      await execAsync('supabase link --project-ref fyrqdguugnyidktzjtku');
    } catch (error) {
      // Project might already be linked
      console.log('Project already linked or link failed:', error.message);
    }
    
    console.log('📤 Pushing database changes...');
    const { stdout, stderr } = await execAsync('supabase db push');
    
    if (stderr) {
      console.error('❌ Error:', stderr);
    }
    
    console.log('✅ Output:', stdout);
    console.log('🎉 Schema applied successfully!');
    console.log('💡 Verify with: node scripts/check-schema.js');
    
  } catch (error) {
    console.error('❌ Error applying schema:', error.message);
    console.error('💡 Try running manually:');
    console.error('  export SUPABASE_ACCESS_TOKEN="' + accessToken + '"');
    console.error('  export PGPASSWORD="' + dbPassword + '"');
    console.error('  supabase db push');
  }
}

applySchema();