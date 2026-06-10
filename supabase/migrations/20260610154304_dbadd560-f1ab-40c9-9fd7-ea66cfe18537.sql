
CREATE TYPE public.match_status AS ENUM ('open', 'closed', 'finished');

CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opponent_name TEXT NOT NULL,
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.match_status NOT NULL DEFAULT 'open',
  bih_final_score INTEGER,
  opponent_final_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.matches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city_display TEXT NOT NULL,
  city_normalized TEXT NOT NULL,
  bih_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  puls_value INTEGER NOT NULL,
  puls_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view submissions"
  ON public.submissions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create a submission"
  ON public.submissions FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 40
    AND char_length(city_display) BETWEEN 1 AND 80
    AND bih_score BETWEEN 0 AND 30
    AND opponent_score BETWEEN 0 AND 30
    AND puls_value BETWEEN 1 AND 100
  );

CREATE INDEX idx_submissions_match_id ON public.submissions(match_id);

INSERT INTO public.matches (opponent_name, kickoff_time, status, bih_final_score, opponent_final_score) VALUES
  ('Protivnik 1', now() + interval '5 days', 'open', NULL, NULL),
  ('Protivnik 2', now() + interval '12 days', 'open', NULL, NULL),
  ('Protivnik 3', now() - interval '6 days', 'finished', 2, 1);
