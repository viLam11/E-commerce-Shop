create type user_type as enum('admin', 'customer');
create type u_gender as enum('male', 'female');
create type status	as enum('active', 'inactive');
create type ranks as enum('silver', 'gold', 'diamond');
create type bool as enum ('Yes', 'No');


create table users(
	uid	 		varchar(100) 	PRIMARY KEY,
	username	varchar(50) 	NOT NULL unique,
	upassword 	varchar(200) 	NOT NULL,
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
	promotion_id	varchar(255),
	constraint fk_promo_of_order	foreign key(promotion_id) references promotion(promotion_id),
	constraint fk_order_prod foreign key(uid)
				references users(uid)
);

-- Trigger Function to update total_payment
CREATE OR REPLACE FUNCTION update_total_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT operation
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'Completed' THEN
            UPDATE users
            SET total_payment = total_payment + NEW.final_price
            WHERE uid = NEW.uid;
        END IF;
    END IF;

    -- Handle DELETE operation
    IF TG_OP = 'DELETE' THEN
        IF OLD.status = 'Completed' THEN
            UPDATE users
            SET total_payment = total_payment - OLD.final_price
            WHERE uid = OLD.uid;
        END IF;
    END IF;

    -- Handle UPDATE operation
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'Completed' AND NEW.status <> 'Completed' THEN
            -- Order was completed but no longer completed
            UPDATE users
            SET total_payment = total_payment - OLD.final_price
            WHERE uid = OLD.uid;
        ELSIF OLD.status <> 'Completed' AND NEW.status = 'Completed' THEN
            -- Order was not completed but now is completed
            UPDATE users
            SET total_payment = total_payment + NEW.final_price
            WHERE uid = NEW.uid;
        ELSIF OLD.status = 'Completed' AND NEW.status = 'Completed' THEN
            -- Order remains completed, adjust for price changes
            UPDATE users
            SET total_payment = total_payment - OLD.final_price + NEW.final_price
            WHERE uid = NEW.uid;
        END IF;
    END IF;

    RETURN NULL; -- Triggers for AFTER events return NULL
END;
$$ LANGUAGE plpgsql;

--DROP FUNCTION update_total_payment()
-- Create the Trigger
CREATE TRIGGER trigger_update_total_payment
AFTER INSERT OR DELETE OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_total_payment();

--DROP TRIGGER trigger_update_total_payment ON orders

-- CREATE OR REPLACE FUNCTION calculate_final_price()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.total_price IS NOT NULL AND NEW.shipping_fee IS NOT NULL THEN
--         NEW.final_price := NEW.total_price - NEW.shipping_fee;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER	final_price
-- BEFORE INSERT OR UPDATE ON orders
-- FOR EACH ROW
-- EXECUTE FUNCTION calculate_final_price();

select* from users;

COPY orders (oid, status, create_time, done_time,shipping_address,quantity, price, shipping_fee,estimated_delivery_time,receive_time,shipping_co,user_id)
FROM 'C:\Program Files\PostgreSQL\17\order3.csv'
DELIMITER ',' 
CSV HEADER;

drop table orders

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
	cate_id		varchar(255)	not null,
	quantity	integer			not null,
	paid_price	integer			not null,
	discount	integer	not null,
	primary key (iid,oid)
	constraint fk_order_prod foreign key(oid) references orders(oid),
	constraint fk_prod_of_order	foreign key(product_id) references product(product_id),
	constraint fk_cate_of_order	foreign key(cate_id) references category(cate_id)
);

select * from promotion;
select * from orders;
select * from product;
select * from users;
select * from image;
alter table promotion
drop column endtime,
add column endtime date default now()
COPY promotion (promotion_id, promotion_name, quantity,description, starttime, endtime, minspent, product_type, promotion_type,discount_value, percentage, max_price_discount)
FROM 'C:\Program Files\PostgreSQL\17\promo.csv'
DELIMITER ',' 
CSV HEADER;
\copy product (pname, price) FROM 'C:\Program Files\PostgreSQL\17\[HTTT] Đồ án tổng hợp - Sheet4 (1).csv' DELIMITER ',' CSV HEADER;


--TEST--
-- TRUY VẤN SQL -- 
-- 1. TẠO USER
INSERT INTO users(user_id, user_name, user_password, first_name, last_name, email, gender, useType, birthday, id_no) 
VALUES('2212254','ngoc', '123456', 'Ngọc', 'Huỳnh', 'ngoc@gmail.com', 'female', 'customer', DATE('03-07-2004') ,'083304003958');

-- 2. Cập nhật user
UPDATE users
SET email = 'newemail@example.com', user_name = 'new_username', birthday = DATE('03-07-2004') 
WHERE user_id = '2212254';

-- 3. Xóa user
DELETE FROM users
WHERE user_id = '2212254';

-- 4. Liệt kê users
SELECT user_name, first_name, last_name, email, gender, birthday, id_No from users;

-- SẢN PHẨM --
-- 2.1 Tạo sản phẩm
select* from product
INSERT INTO product
VALUES ('prod001', 'Điện thoại Samsung galaxy note 10', 'Smartphone', 'Samsung', '1 sản phẩm đến từ Samsung', 10000000, 115);

-- 2.2 Cập nhật sản phẩm
UPDATE product
SET	description = 'mô tả mới'
WHERE product_id = 'p0000001';

-- 2.3 Xóa sản phẩm

-- 2.4 Liệt kê sản phẩm
SELECT * FROM product;


-- ORDER
-- 3.1 Tìm kiếm đơn đặt hàng theo userID
SELECT * FROM orders
WHERE orders.user_id = 'user000010';

-- 3.2 Tính số tiền userID đã chi
-- CREATE OR REPLACE FUNCTION check_expense(
--     userID varchar(255)
-- )
-- RETURNS INTEGER AS $$
-- DECLARE
--     totalAmount INTEGER := 0;
--     coursePrice INTEGER;
-- BEGIN
--     FOR coursePrice IN 
--         SELECT price
--         FROM orders o
--         WHERE o.user_id = userID
--     LOOP
--         totalAmount := totalAmount + coursePrice;
--     END LOOP;

--     RETURN totalAmount;
-- END;
-- $$ LANGUAGE plpgsql;

-- SELECT check_expense('user000001');

-- create table carts(
-- 	uid			varchar(255)	not null,
-- 	rating		integer			not null check(rating >= 1 and rating <=5),
-- 	comment	text,
-- 	time		timestamp 		default now(),
-- 	primary key(product_id, uid),
-- 	constraint fk_review_prod foreign key(product_id) references product(product_id),
-- 	constraint fk_cus_review	foreign key(uid) references users(uid)
-- )

CREATE TABLE cart (
    uid          VARCHAR(255) NOT NULL,
    product_id   VARCHAR(255) NOT NULL,
    quantity     INTEGER      NOT NULL DEFAULT 1 CHECK(quantity > 0),
    PRIMARY KEY (uid,product_id),
    CONSTRAINT fk_addtocart_productid FOREIGN KEY (product_id) REFERENCES product(product_id),
    CONSTRAINT fk_addtocart_uid FOREIGN KEY (uid) REFERENCES users(uid)
);
INSERT INTO cart(uid, product_id, quantity) 
VALUES('8f0f389a-4ff3-4a1d-a29f-3b331929a50f','ptemp','10');
-- INSERT INTO cart(uid, product_id, quantity) 
-- VALUES('8f0f389a-4ff3-4a1d-a29f-3b331929a50f','ptemp','10');

CREATE TABLE notification (
    uid         VARCHAR(255) 	NOT NULL,
    content   	TEXT 			NOT NULL,
    create_date TIMESTAMP  	NOT NULL DEFAULT NOW(),

    PRIMARY KEY (uid,content),
    CONSTRAINT fk_uid_notify FOREIGN KEY (uid) REFERENCES users(uid)
);
INSERT INTO users(uid, username, upassword, fname, lname, email, gender, usertype, birthday, id_no) 
VALUES('ALL','ALL', 'ALL', 'ALL', 'ALL', 'ALL', 'male', 'admin', DATE('03-07-2004') ,'ALL');
INSERT INTO notification(uid, content) 
VALUES('ALL','thông báo toàn sàn ngày 4/12/2024');
INSERT INTO notification(uid, content) 
VALUES('8f0f389a-4ff3-4a1d-a29f-3b331929a50f','thông báo ngày 12 tháng 12');
