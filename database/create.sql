create table user (
	id text not null,
	name text not null,
	primary key(id)
);

create table enum_permission(
 id integer not null,
 permission text not null,
 primary key(id)
);

create table enum_amount_unit(
	id integer not null,
	locale text not null,
	name text not null,
	short_name text not null,
	primary key(id, locale)
);

create table enum_grocery_item(
	id integer not null,
	locale text not null,
	name text not null,
  preferred_amount_unit_id integer,
	primary key(id, locale),
  FOREIGN KEY(preferred_amount_unit_id) REFERENCES enum_amount_unit(id)
);

create table recipe(
	id integer not null,
	locale text not null,
	name text not null,
	description text,
	primary key(id)
);

create table recipe_ingredient(
	recipe_id integer not null,
	grocery_item_id integer not null,
	amount int not null,
	amount_unit_id integer not null,
	primary key(recipe_id, grocery_item_id),
	FOREIGN KEY(recipe_id) REFERENCES recipe(id),
	FOREIGN KEY(grocery_item_id) REFERENCES enum_grocery_item(id),
	FOREIGN KEY(amount_unit_id) REFERENCES enum_amount_unit(id)
);

create table grocery_list(
	id integer not null,
	name text not null,
	created_at text not null, 
	updated_at text not null, 
	primary key (id)
);

create table grocery_list_permission(
	user_id text not null,
	grocery_list_id integer not null,
	permission_id integer not null,
	primary key (user_id, grocery_list_id),
	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id),
	FOREIGN KEY(permission_id) REFERENCES enum_permission(id)
);

create table grocery_list_item(
	id integer not null,
	grocery_list_id integer not null,
	grocery_item_id integer not null,
	amount int not null, 
	amount_unit_id integer not null, 
  bought boolean,
	primary key (id),
	FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id),
	FOREIGN KEY(grocery_item_id) REFERENCES enum_grocery_item(id),
	FOREIGN KEY(amount_unit_id) REFERENCES enum_amount_unit(id)
);

create table calendar_entry_recipe(
  id integer not null,
  user_id text not null,
  recipe_id integer not null,
  date text not null,
  primary key(id),
	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(recipe_id) REFERENCES recipe(id)
);

create table calendar_entry_grocery_list(
  id integer,
  user_id text,
  grocery_list_id integer,
  date text not null,
  primary key(id),
	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id)
);
