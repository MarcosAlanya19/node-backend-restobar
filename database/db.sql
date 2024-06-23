CREATE TYPE UserRole AS ENUM ('customer', 'administrator');
CREATE TABLE User_Store (
    ID SERIAL PRIMARY KEY,
    user_name VARCHAR(50),
    user_password VARCHAR(255),
    email VARCHAR(100)
    phone_number VARCHAR(20),
    address VARCHAR(255);
    role UserRole DEFAULT 'customer'
);

CREATE TABLE Store (
    ID SERIAL PRIMARY KEY,
    store_name VARCHAR(100),
    public_id VARCHAR(255),
    secure_url VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(20),
    description VARCHAR(255),
    opening_hour TIME,
    closing_hour TIME
);

CREATE TYPE MenuItemType AS ENUM ('beverage', 'burger', 'other');
CREATE TABLE MenuItem (
    ID SERIAL PRIMARY KEY,
    item_name VARCHAR(100),
    public_id VARCHAR(255),
    secure_url VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2)
);
ALTER TABLE MenuItem ADD COLUMN type MenuItemType;


-- MANY TO MANY
CREATE TABLE StoreMenuItem (
    store_id INT,
    item_id INT,
    PRIMARY KEY (store_id, item_id),
    FOREIGN KEY (store_id) REFERENCES Store(ID),
    FOREIGN KEY (item_id) REFERENCES MenuItem(ID)
);


CREATE TYPE OrderStatus AS ENUM ('pending', 'in_process', 'delivered', "rejected");
CREATE TABLE "Order" (
    ID SERIAL PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status OrderStatus DEFAULT 'pending',
    assigned_store_id INT,
    FOREIGN KEY (user_id) REFERENCES User_Store(ID),
    FOREIGN KEY (assigned_store_id) REFERENCES Store(ID)
);

CREATE TABLE OrderItem (
    order_id INT,
    item_id INT,
    quantity INT,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES "Order"(ID),
    FOREIGN KEY (item_id) REFERENCES MenuItem(ID)
);
