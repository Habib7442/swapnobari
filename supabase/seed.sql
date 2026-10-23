-- Starter data. Safe to re-run (upserts on unique keys).
-- Rates and package features are NOT seeded: they must come from the client (AGENTS.md §14).
-- Until rates exist, the estimator saves the lead and promises an estimate instead of showing numbers.

-- Northeast first: Assam, then Tripura.
insert into public.states (name, slug, sort) values
  ('Assam', 'assam', 1),
  ('Tripura', 'tripura', 2)
on conflict (slug) do update set name = excluded.name, sort = excluded.sort;

-- District headquarters and major towns. Silchar sorts first, so the form defaults to it.
-- City slugs are unique across India: suffix the state when a name repeats elsewhere.
-- Re-running updates name/state/sort but keeps any status an admin has changed.
insert into public.cities (state_id, name, slug, sort)
select s.id, v.name, v.slug, v.sort
from (values
  ('assam', 'Silchar', 'silchar', 1),
  ('assam', 'Guwahati', 'guwahati', 2),
  ('assam', 'Amingaon', 'amingaon', 100),
  ('assam', 'Badarpur', 'badarpur', 101),
  ('assam', 'Barpeta', 'barpeta', 102),
  ('assam', 'Bilasipara', 'bilasipara', 103),
  ('assam', 'Biswanath Chariali', 'biswanath-chariali', 104),
  ('assam', 'Bongaigaon', 'bongaigaon', 105),
  ('assam', 'Dhemaji', 'dhemaji', 106),
  ('assam', 'Dhubri', 'dhubri', 107),
  ('assam', 'Dibrugarh', 'dibrugarh', 108),
  ('assam', 'Digboi', 'digboi', 109),
  ('assam', 'Diphu', 'diphu', 110),
  ('assam', 'Duliajan', 'duliajan', 111),
  ('assam', 'Goalpara', 'goalpara', 112),
  ('assam', 'Golaghat', 'golaghat', 113),
  ('assam', 'Haflong', 'haflong', 114),
  ('assam', 'Hailakandi', 'hailakandi', 115),
  ('assam', 'Hamren', 'hamren', 116),
  ('assam', 'Hatsingimari', 'hatsingimari', 117),
  ('assam', 'Hojai', 'hojai', 118),
  ('assam', 'Jorhat', 'jorhat', 119),
  ('assam', 'Kajalgaon', 'kajalgaon', 120),
  ('assam', 'Kokrajhar', 'kokrajhar', 121),
  ('assam', 'Lumding', 'lumding', 122),
  ('assam', 'Majuli (Garamur)', 'majuli', 123),
  ('assam', 'Mangaldoi', 'mangaldoi', 124),
  ('assam', 'Margherita', 'margherita', 125),
  ('assam', 'Morigaon', 'morigaon', 126),
  ('assam', 'Mushalpur', 'mushalpur', 127),
  ('assam', 'Nagaon', 'nagaon', 128),
  ('assam', 'Nalbari', 'nalbari', 129),
  ('assam', 'North Lakhimpur', 'north-lakhimpur', 130),
  ('assam', 'Pathsala', 'pathsala', 131),
  ('assam', 'Rangia', 'rangia', 132),
  ('assam', 'Sivasagar', 'sivasagar', 133),
  ('assam', 'Sonari', 'sonari', 134),
  ('assam', 'Sribhumi (Karimganj)', 'sribhumi', 135),
  ('assam', 'Tamulpur', 'tamulpur', 136),
  ('assam', 'Tezpur', 'tezpur', 137),
  ('assam', 'Tinsukia', 'tinsukia', 138),
  ('assam', 'Udalguri', 'udalguri', 139),
  ('tripura', 'Agartala', 'agartala', 200),
  ('tripura', 'Amarpur', 'amarpur', 201),
  ('tripura', 'Ambassa', 'ambassa', 202),
  ('tripura', 'Belonia', 'belonia', 203),
  ('tripura', 'Bishalgarh', 'bishalgarh', 204),
  ('tripura', 'Bishramganj', 'bishramganj', 205),
  ('tripura', 'Dharmanagar', 'dharmanagar', 206),
  ('tripura', 'Kailashahar', 'kailashahar', 207),
  ('tripura', 'Kamalpur', 'kamalpur', 208),
  ('tripura', 'Khowai', 'khowai', 209),
  ('tripura', 'Kumarghat', 'kumarghat', 210),
  ('tripura', 'Melaghar', 'melaghar', 211),
  ('tripura', 'Sabroom', 'sabroom', 212),
  ('tripura', 'Santirbazar', 'santirbazar', 213),
  ('tripura', 'Sonamura', 'sonamura', 214),
  ('tripura', 'Teliamura', 'teliamura', 215),
  ('tripura', 'Udaipur', 'udaipur-tripura', 216)
) as v(state_slug, name, slug, sort)
join public.states s on s.slug = v.state_slug
on conflict (slug) do update set state_id = excluded.state_id, name = excluded.name, sort = excluded.sort;

-- Areas: add the client's confirmed list, e.g.
-- insert into public.areas (city_id, name, slug, pin)
-- select id, 'Tarapur', 'tarapur', '788003' from public.cities where slug = 'silchar';

insert into public.budget_packages (slug, name, tagline, sort) values
  ('basic', 'Basic', 'Good quality, budget-friendly', 1),
  ('standard', 'Standard', 'Most popular balance of quality and cost', 2),
  ('premium', 'Premium', 'Top brands and finishes', 3)
on conflict (slug) do update set name = excluded.name, tagline = excluded.tagline, sort = excluded.sort;

-- Typical residential split, for the client to confirm before launch. Must total 100.
delete from public.budget_stages;
insert into public.budget_stages (name, percent, ground_floor_only, sort) values
  ('Design & approvals',        3, false,  1),
  ('Excavation & foundation',  12, true,   2),
  ('RCC structure',            25, false,  3),
  ('Brickwork & plastering',   15, false,  4),
  ('Flooring & tiling',        10, false,  5),
  ('Electrical',                6, false,  6),
  ('Plumbing & sanitary',       7, false,  7),
  ('Doors & windows',           8, false,  8),
  ('Painting & finishing',      8, false,  9),
  ('Contingency & misc.',       6, false, 10);

insert into public.site_settings (key, value, is_public) values
  ('estimate_range_percent', '10', true),
  ('estimate_disclaimer', '"Approximate estimate. Final cost depends on design, site and materials."', true),
  ('duplicate_window_days', '30', false)
on conflict (key) do nothing;
