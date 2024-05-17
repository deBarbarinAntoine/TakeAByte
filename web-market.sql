CREATE TABLE users
(
    user_id             INT AUTO_INCREMENT,
    username            VARCHAR(25) NOT NULL,
    mail                VARCHAR(50) NOT NULL,
    password            VARCHAR(50) NOT NULL,
    creation_date       DATETIME    NOT NULL,
    last_connection     DATETIME    NOT NULL,
    country             CHAR(3),
    city                VARCHAR(50),
    Zip_Code            INT,
    street_name         VARCHAR(100),
    street_number       SMALLINT,
    address_complements VARCHAR(300),
    PRIMARY KEY (user_id),
    UNIQUE (username),
    UNIQUE (mail)
);

CREATE TABLE products
(
    Id_products        INT AUTO_INCREMENT,
    name               VARCHAR(100)  NOT NULL,
    description        VARCHAR(500)  NOT NULL,
    quantity_stocked   SMALLINT      NOT NULL,
    price              DECIMAL(9, 2) NOT NULL,
    processor          VARCHAR(200),
    RAM                VARCHAR(50),
    size               VARCHAR(50),
    captor             VARCHAR(50),
    weight             VARCHAR(100),
    socket_cpu         VARCHAR(50),
    dimension          VARCHAR(100),
    others             VARCHAR(300),
    connectics         VARCHAR(500),
    resolution         VARCHAR(100),
    screen_type        VARCHAR(50),
    vram               VARCHAR(100),
    battery_power_time VARCHAR(100),
    Type               VARCHAR(100)  NOT NULL,
    storage            VARCHAR(20),
    couleur            VARCHAR(50),
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id_products)
);

CREATE TABLE Images
(
    Id_Images   INT AUTO_INCREMENT,
    image_path  VARCHAR(200) NOT NULL,
    ind         INT          NOT NULL,
    upload_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Id_products INT          NOT NULL,
    PRIMARY KEY (Id_Images),
    UNIQUE (image_path),
    FOREIGN KEY (Id_products) REFERENCES products (Id_products)
);

CREATE TABLE orders
(
    user_id         INT,
    Id_products     INT,
    date_ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantity        SMALLINT NOT NULL,
    PRIMARY KEY (user_id, Id_products),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (Id_products) REFERENCES products (Id_products)
);

CREATE TABLE likes
(
    user_id     INT,
    Id_products INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, Id_products),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (Id_products) REFERENCES products (Id_products)
);
