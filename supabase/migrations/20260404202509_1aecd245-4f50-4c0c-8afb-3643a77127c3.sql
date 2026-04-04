
-- Table to track deleted/hidden listings
CREATE TABLE public.deleted_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id INTEGER NOT NULL UNIQUE,
  deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deleted_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read (to filter out deleted listings in the UI)
CREATE POLICY "Anyone can read deleted listings"
  ON public.deleted_listings FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert (delete a listing)
CREATE POLICY "Admins can delete listings"
  ON public.deleted_listings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also allow anon to read for public filtering
CREATE POLICY "Public can read deleted listings"
  ON public.deleted_listings FOR SELECT
  TO anon
  USING (true);
