-- Extend projects table with file structure and metadata
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS file_structure JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS active_file_id TEXT;

-- Create project_files table for better file management
CREATE TABLE IF NOT EXISTS project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  content TEXT DEFAULT '', -- Only for files
  parent_id UUID REFERENCES project_files(id) ON DELETE CASCADE,
  is_open BOOLEAN DEFAULT false, -- For folders
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_parent_id ON project_files(parent_id);

-- Enable RLS
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_files
CREATE POLICY "Users can view their own project files" ON project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = (auth.uid())
    )
  );

CREATE POLICY "Users can insert their own project files" ON project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = (auth.uid())
    )
  );

CREATE POLICY "Users can update their own project files" ON project_files
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = (auth.uid())
    )
  );

CREATE POLICY "Users can delete their own project files" ON project_files
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = (auth.uid())
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_project_files
  BEFORE UPDATE ON project_files
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create default file structure for new projects
CREATE OR REPLACE FUNCTION create_default_project_files(project_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO project_files (project_id, name, type, content) VALUES
    (project_id, 'index.js', 'file', '// Canvas Academy Project
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Your code here
ctx.fillStyle = "#007acc";
ctx.fillRect(50, 50, 200, 100);
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Hello Canvas!", 80, 110);
');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update projects table to include better metadata
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'canvas' CHECK (project_type IN ('canvas', 'webgl', 'p5js'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'unlisted'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;