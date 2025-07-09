import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  try {
    console.log('Checking if project_files table exists...');
    
    // Try to query the project_files table
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ project_files table does not exist');
        console.log('Please apply the schema using Supabase Dashboard SQL Editor');
        console.log('Schema file location: database/project_files_schema.sql');
      } else {
        console.log('❌ Error checking table:', error);
      }
    } else {
      console.log('✅ project_files table exists');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();