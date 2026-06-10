-- Correct opponent names, Sarajevo kickoff times, and replace Germany with Qatar.

UPDATE public.matches SET
  opponent_name = 'Kanada',
  kickoff_time = '2026-06-12 19:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '12.06.2026 15:00 UTC-4'
WHERE opponent_name IN ('Kanada', 'Protivnik 1');

UPDATE public.matches SET
  opponent_name = 'Švicarska',
  kickoff_time = '2026-06-18 19:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '18.06.2026 15:00 UTC-4'
WHERE opponent_name IN ('Švicarska', 'Protivnik 2');

UPDATE public.matches SET
  opponent_name = 'Katar',
  kickoff_time = '2026-06-24 19:00:00+00',
  status = 'open',
  bih_final_score = NULL,
  opponent_final_score = NULL,
  local_time_label = '24.06.2026 15:00 UTC-4'
WHERE opponent_name IN ('Katar', 'Njemačka', 'Protivnik 3');
