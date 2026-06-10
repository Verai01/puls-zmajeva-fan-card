ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS local_time_label TEXT;

DELETE FROM public.submissions;

UPDATE public.matches SET
  opponent_name = 'Kanada',
  kickoff_time = '2026-06-12 19:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '12.06.2026 15:00 UTC-4'
WHERE id = '2e44dfa0-6cda-4f8c-904f-8d84334c56ad';

UPDATE public.matches SET
  opponent_name = 'Švicarska',
  kickoff_time = '2026-06-18 18:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '18.06.2026 14:00 UTC-4'
WHERE id = '02049d09-223d-4a00-a406-7a8ed183d935';

UPDATE public.matches SET
  opponent_name = 'Njemačka',
  kickoff_time = '2026-06-24 19:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '24.06.2026 15:00 UTC-4'
WHERE id = 'd5547e01-93db-464f-b187-29a8067fea42';