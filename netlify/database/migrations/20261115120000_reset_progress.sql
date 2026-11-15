-- One-time reset requested by Tarun on 2026-11-15: clear all stars, completed games,
-- session logs, checks and skill levels so Medhu starts fresh.
TRUNCATE TABLE rewards, quest_completions, logs, checks, skill_levels, skill_level_history RESTART IDENTITY;
