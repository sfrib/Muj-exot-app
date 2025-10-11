-- Minimal seed dat pro druhové karty (ukázka)
insert into public.species (common_name, scientific_name, origin, temp_min, temp_max, humidity_min, humidity_max, uvb_need, enclosure_notes, wild_diet, captive_diet)
values
('Agama vousatá', 'Pogona vitticeps', 'Austrálie (polopouště)', 25, 40, 20, 40, 'UVB T5 10–12%', 'Terárium 120×60×60, výhřevné místo 40–45°C', 'Hmyz, rostlinná složka', 'Švábi, cvrčci, listová zelenina, příp. Ca+D3'),
('Krajta královská', 'Python regius', 'Západní Afrika (savany)', 26, 32, 50, 70, 'Není UVB nutné, ale lze nízké', 'Úkryty, mírná vlhkost, noční pokles teplot', 'Hlodavci', 'Mražené myši/potkani, dle hmotnosti'),
('Ara ararauna', 'Ara ararauna', 'Jižní Amerika (tropy)', 22, 28, 50, 80, 'Přirozené slunce/UVB volitelně', 'Prostorná voliera, enrichment', 'Ovoce, semena, ořechy', 'Kompletní směs + ořechy, zelenina, ovoce');
