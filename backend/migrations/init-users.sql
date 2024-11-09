create type user_type as enum('admin', 'customer');
create type u_gender as enum('male', 'female');
create type status	as enum('active', 'inactive');
create type ranks as enum('silver', 'gold', 'diamond');
create type bool as enum ('Yes', 'No');

create table users(
	uid	 		varchar(100) 	PRIMARY KEY,
	username	varchar(50) 	NOT NULL unique,
	upassword 	varchar(33) 	NOT NULL,
	fname		varchar(32) 	NOT NULL,
	lname		varchar(32) 	NOT NULL,
	email		varchar(50) 	NOT NULL unique,
	gender		u_gender 		not null,
	userType	user_type 		NOT NULL,
	ranking		ranks,
	birthday	DATE,
	total_payment integer		default 0,
	id_no		varchar(20)
);

CREATE OR REPLACE FUNCTION check_role_constraint()
RETURNS TRIGGER AS $$
BEGIN
    IF ((NEW.birthday IS  NULL or NEW.ranking is null) AND NEW.usertype = 'customer')  
		or (new.usertype ='admin' and new.id_no is null) 
	THEN
        RAISE EXCEPTION 'Error insertion';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_constraint
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION check_role_constraint();

create table user_phone(
	uid			varchar(100)	not null,
	phone		varchar(11)		not null,
	primary key(uid, phone),
	constraint fk_user_phone	foreign key(uid)
								references users(uid)
);


create table user_address(
	uid			varchar(100)	not null,
	address		text			not null,
	isdefault	bool			not null,
	primary key(uid, address),
	constraint fk_user_address	foreign key(uid)
								references users(uid)
);

create table category(
	cate_id		varchar(100)	primary key,
	cate_name	varchar(33)		not null
);

CREATE TABLE product(
	product_id			varchar(100)	PRIMARY KEY,
	pname				varchar(100)	NOT NULL,
	brand				varchar(100)	NOT NULL,
	description			TEXT,
	price				INTEGER			NOT NULL check(price > 0),
	quantity			INTEGER			not null Check(quantity >= 0),
	create_time	timestamp 		default now(),
	cate_id				varchar(100)	not null,
	sold 				integer			default 0,
	rating				smallint			default 0,
	constraint fk_category	foreign key (cate_id) references category(cate_id)
);

create table image(
	product_id 	varchar(255) ,
	image_id	varchar(255) ,
	image_url	text	not null,
	ismain		bool	default 'No',
	primary key(product_id, image_id),
	constraint fk_prod_img foreign key(product_id)
				references product(product_id)
				on delete cascade
);

create type discount as enum('fix price', 'percent');
create type apply_type as enum ('product', 'category', 'all');
create table promotion(
	promotion_id	varchar(100)	PRIMARY KEY,
	name		varchar(100)	NOT NULL,
	quantity		INTEGER			check(quantity >= 0),
	description		text	,
	starttime		date		default now(),
	endtime			date		default now(),
	minspent		INTEGER			not null,
	value		integer			check (value < minSpent),
	percentage		integer			,
	max_amount		integer			check (max_amount < minSpent),		
	apply_id		varchar(50)		,
	apply_range		apply_type		not null
);

CREATE OR REPLACE FUNCTION check_promo_constraint()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.discount_type = 'fix_price' and NEW.fix_value is null) 
		or (NEW.discount_type = 'percent'  and (new.percentage is null or new.max_amount is null)) 
	THEN
        RAISE EXCEPTION 'Error';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER promo_constraint
-- BEFORE INSERT ON users
-- FOR EACH ROW
-- EXECUTE FUNCTION check_promo_constraint();

DROP TRIGGER IF EXISTS promo_constraint ON users;


create type deli_state as enum('Cancelled','Completed','Returned','Shipped','Pending','Paid');
create table orders(
	oid						varchar(100) 	primary key,
	uid						varchar(100) 	not null ,
	status					deli_state	 	not null,
	create_time				date	 	 	default now(),
	done_time				date	 	 	default now(),
	shipping_address		varchar(100) 	not null,
	shipping_fee			integer		 	default 0,
	estimated_delivery_time	date			default now(),
	receive_time			date	 		default now(),
	shipping_co				varchar(50) 	not null,
	quantity				integer			not null,
	total_price					integer			not null,
	final_price				integer			not null,
	constraint fk_order_prod foreign key(uid)
				references users(uid)
);

CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_price IS NOT NULL AND NEW.shipping_fee IS NOT NULL THEN
        NEW.final_price := NEW.total_price - NEW.shipping_fee;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER	final_price
BEFORE INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION calculate_final_price();


create table reviews(
	product_id	varchar(255)	not null,
	uid		varchar(100)	not null,
	rating		integer			not null check(rating >= 1 and rating <=5),
	comment	text,
	time		timestamp 		default now(),
	primary key(product_id, uid),
	constraint fk_review_prod foreign key(product_id) references product(product_id),
	constraint fk_cus_review	foreign key(uid) references users(uid)
);


create table order_include(
	iid	smallint	not null,
	oid	varchar(255)	not null,
	product_id 	varchar(255)	not null,
	promotion_id	varchar(255)	not null,
	cate_id		varchar(255)	not null,
	quantity	integer			not null,
	paid_price	integer			not null,
	discount	integer	not null,
	constraint fk_order_prod foreign key(oid) references orders(oid),
	constraint fk_prod_of_order	foreign key(product_id) references product(product_id),
	constraint fk_promo_of_order	foreign key(promotion_id) references promotion(promotion_id),
	constraint fk_cate_of_order	foreign key(cate_id) references category(cate_id)
);

create type action_type as enum ('add', 'delete', 'update');
