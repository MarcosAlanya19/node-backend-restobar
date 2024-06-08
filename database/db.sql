CREATE TABLE User_Store (
    ID SERIAL PRIMARY KEY,
    user_name VARCHAR(50),
    user_password VARCHAR(255),
    email VARCHAR(100)
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

CREATE TABLE Burger (
    ID SERIAL PRIMARY KEY,
    burger_name VARCHAR(100),
    public_id VARCHAR(255),
    secure_url VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2)
);

-- MANY TO MANY
CREATE TABLE Store_Burger (
    store_id INT,
    burger_id INT,
    PRIMARY KEY (store_id, burger_id),
    FOREIGN KEY (store_id) REFERENCES Store(ID),
    FOREIGN KEY (burger_id) REFERENCES Burger(ID)
);
