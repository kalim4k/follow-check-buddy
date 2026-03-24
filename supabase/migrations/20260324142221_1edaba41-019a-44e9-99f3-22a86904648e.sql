ALTER TABLE public.profiles ADD COLUMN has_shared BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN has_reposted BOOLEAN NOT NULL DEFAULT false;