-- Create profiles table
CREATE TABLE public.profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  has_liked BOOLEAN NOT NULL DEFAULT false,
  has_commented BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profile_stats table (single row)
CREATE TABLE public.profile_stats (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  abonnements TEXT NOT NULL DEFAULT '26',
  abonnes TEXT NOT NULL DEFAULT '10K',
  jaime TEXT NOT NULL DEFAULT '32.5K'
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_stats ENABLE ROW LEVEL SECURITY;

-- Public access policies for profiles
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete profiles" ON public.profiles FOR DELETE USING (true);

-- Public access policies for profile_stats
CREATE POLICY "Anyone can read stats" ON public.profile_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stats" ON public.profile_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stats" ON public.profile_stats FOR UPDATE USING (true);

-- Insert default stats row
INSERT INTO public.profile_stats (abonnements, abonnes, jaime) VALUES ('26', '10K', '32.5K');

-- Insert default profiles
INSERT INTO public.profiles (username, name, verified, is_subscribed, has_liked, has_commented) VALUES
  ('alex_dev', 'Alexandre', false, true, false, true),
  ('marie.design', 'Marie UX', true, true, true, false),
  ('lucas_99', 'Lucas', false, false, false, false),
  ('sophie_art', 'Sophie', false, true, true, true),
  ('thomas.code', 'Thomas', true, false, true, false);

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

CREATE POLICY "Anyone can upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos');
CREATE POLICY "Anyone can view profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Anyone can delete profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos');