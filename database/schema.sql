-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  skill_level TEXT DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  example_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, example_id)
);

-- Create indexes for foreign keys
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING ((auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING ((auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK ((auth.uid()) = id);

-- Create RLS policies for projects
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

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING ((auth.uid()) = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK ((auth.uid()) = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING ((auth.uid()) = user_id);

-- Create function to automatically create user profile
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

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = '';
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();