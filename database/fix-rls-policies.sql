-- Fix RLS policies for project_files table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "project_files_select_policy" ON project_files;
DROP POLICY IF EXISTS "project_files_insert_policy" ON project_files;
DROP POLICY IF EXISTS "project_files_update_policy" ON project_files;
DROP POLICY IF EXISTS "project_files_delete_policy" ON project_files;

-- Create new RLS policies for project_files
CREATE POLICY "project_files_select_policy" ON project_files
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "project_files_insert_policy" ON project_files
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "project_files_update_policy" ON project_files
    FOR UPDATE USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "project_files_delete_policy" ON project_files
    FOR DELETE USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

-- Make sure RLS is enabled
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;