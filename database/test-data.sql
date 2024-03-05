insert into enum_permission(id, permission) values 
(1, 'admin'),
(2, 'owner'),
(3, 'editor'),
(4, 'reader');

insert into user(id, name) values
('test', 'Ja');

insert into enum_amount_unit(id, locale, name, short_name) values
(1, 'en', 'liters', 'l'), 
(2, 'en', 'kilograms', 'kg'),
(3, 'en', 'pieces', 'pcs'),

(1, 'pl', 'litry', 'l'),
(2, 'pl', 'kilogramy', 'kg'),
(3, 'pl', 'sztuk', 'szt');

insert into enum_grocery_item(id, locale, name, preferred_amount_unit_id) values
(1, 'en', 'tomatoes', 2),
(2, 'en', 'bread', 3),
(3, 'en', 'apples', 2),
(4, 'en', 'potatoes', 2),
(5, 'en', 'chocolate', 3),


(1, 'pl', 'pomidory', 2),
(2, 'pl', 'chleb', 3),
(3, 'pl', 'jabłka', 2),
(4, 'pl', 'ziemniaki', 2),
(5, 'pl', 'czekolada', 3);
