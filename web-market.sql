CREATE TABLE users
(
    user_id             INT AUTO_INCREMENT,
    username            VARCHAR(25)  NOT NULL,
    email               VARCHAR(100) NOT NULL,
    password_hash       CHAR(60)     NOT NULL,
    creation_date       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    country             CHAR(3),
    city                VARCHAR(50),
    zip_code            VARCHAR(10),
    street_name         VARCHAR(100),
    street_number       SMALLINT,
    address_complements VARCHAR(300),
    PRIMARY KEY (user_id),
    UNIQUE (username),
    UNIQUE (email)
) ENGINE = INNODB;

CREATE TABLE brands
(
    brand_id INT AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    PRIMARY KEY (brand_id),
    UNIQUE (name)
) ENGINE = INNODB;

CREATE TABLE colors
(
    color_id INT AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    PRIMARY KEY (color_id),
    UNIQUE (name)
) ENGINE = INNODB;

CREATE TABLE types
(
    type_id INT AUTO_INCREMENT,
    name    VARCHAR(100) NOT NULL,
    PRIMARY KEY (type_id),
    UNIQUE (name)
) ENGINE = INNODB;

CREATE TABLE products
(
    product_id         INT AUTO_INCREMENT,
    name               VARCHAR(100)  NOT NULL,
    description        VARCHAR(500)  NOT NULL,
    quantity_stocked   SMALLINT      NOT NULL CHECK (quantity_stocked >= 0) DEFAULT 0,
    price              DECIMAL(9, 2) NOT NULL,
    processor          VARCHAR(200),
    ram                VARCHAR(50),
    size               VARCHAR(50),
    captor             VARCHAR(50),
    weight             VARCHAR(100),
    socket_cpu         VARCHAR(50),
    dimension          VARCHAR(100),
    others             VARCHAR(300),
    connectivity       VARCHAR(500),
    resolution         VARCHAR(100),
    screen_type        VARCHAR(50),
    vram               VARCHAR(100),
    battery_power_time VARCHAR(100),
    type_id            INT,
    storage            VARCHAR(20),
    brand_id           INT,
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id),
    FOREIGN KEY (type_id) REFERENCES types (type_id),
    FOREIGN KEY (brand_id) REFERENCES brands (brand_id)
) ENGINE = INNODB;

CREATE TABLE product_colors
(
    product_id INT,
    color_id   INT,
    PRIMARY KEY (product_id, color_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors (color_id) ON DELETE CASCADE,
    UNIQUE (product_id, color_id)
) ENGINE = INNODB;

CREATE TABLE images
(
    image_id    INT AUTO_INCREMENT,
    image_path  VARCHAR(255) NOT NULL,
    ind         INT          NOT NULL,
    upload_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id  INT          NOT NULL,
    PRIMARY KEY (image_id),
    UNIQUE (image_path),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
) ENGINE = INNODB;

CREATE TABLE orders
(
    order_id        INT AUTO_INCREMENT,
    user_id         INT,
    product_id      INT,
    date_ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantity        SMALLINT NOT NULL CHECK (quantity > 0) DEFAULT 1,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (product_id)
) ENGINE = INNODB;

CREATE TABLE likes
(
    user_id    INT,
    product_id INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (product_id)
) ENGINE = INNODB;

CREATE TABLE sales
(
    sale_id    INT AUTO_INCREMENT,
    product_id INT,
    sale_price DECIMAL(9, 2) NOT NULL,
    start_date DATETIME      NOT NULL,
    end_date   DATETIME      NOT NULL CHECK (end_date > start_date),
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (sale_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    INDEX (product_id)
) ENGINE = INNODB;

CREATE TABLE token
(
    token_id INT AUTO_INCREMENT,
    user_id  INT,
    end_date DATETIME NOT NULL,
    token    VARCHAR(500) UNIQUE,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE = INNODB;
