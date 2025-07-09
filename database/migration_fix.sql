-- Add missing indexes (기존 테이블에 인덱스 추가)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Drop and recreate RLS policies with improved performance
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING ((auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING ((auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK ((auth.uid()) = id);

-- Projects policies
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view public projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING ((auth.uid()) = user_id);

CREATE POLICY "Users can view public projects" ON projects
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK ((auth.uid()) = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING ((auth.uid()) = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING ((auth.uid()) = user_id);

-- User progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;

CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING ((auth.uid()) = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK ((auth.uid()) = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING ((auth.uid()) = user_id);

-- Update functions with security improvements
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = '';
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = '';
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;