create table user (
	id text,
	name text,
	primary key(id)
);

create table grocery_list(
	id integer,
	name text,
	created_at text, 
	updated_at text, 
	primary key (id)
);

create table grocery_item(
	id integer,
  preferred_amount_unit_id integer,
	primary key(id),
	FOREIGN KEY(preferred_amount_unit_id) REFERENCES amount_unit_translation(id)
);

create table recipe(
	id integer,
	name text,
	description text,
	locale text,
	primary key(id)
);

create table amount_unit_translation(
	id integer,
	locale text,
	translation text,
	short_translation text,
	primary key(id, locale)
);

create table grocery_list_access_level(
	user_id text,
	grocery_list_id integer,
	access_level,
	primary key (user_id, grocery_list_id),
	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id)
);

create table grocery_list_item(
	id integer,
	grocery_list_id integer,
	grocery_item_id integer,
	amount int, 
	amount_unit_id integer, 
  bought boolean,
	primary key (id),
	FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id),
	FOREIGN KEY(grocery_item_id) REFERENCES grocery_item(id),
	FOREIGN KEY(amount_unit_id) REFERENCES amount_unit_translation(id)
);

create table grocery_item_translation(
	grocery_item_id integer,
	locale text,
	name text,
	primary key(grocery_item_id, locale),
	FOREIGN KEY(grocery_item_id) REFERENCES grocery_item(id)
);

create table recipe_ingredient(
	recipe_id integer,
	grocery_item_id integer,
	amount int not null,
	amount_unit_id integer,
	primary key(recipe_id),
	FOREIGN KEY(recipe_id) REFERENCES recipe(id),
	FOREIGN KEY(grocery_item_id) REFERENCES grocery_item(id),
	FOREIGN KEY(amount_unit_id) REFERENCES amount_unit(id)
);

