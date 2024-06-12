CREATE TABLE users
(
    user_id             INT AUTO_INCREMENT,
    username            VARCHAR(25)  NOT NULL,
    email               VARCHAR(100) NOT NULL,
    password_hash       CHAR(60)     NOT NULL,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    country             CHAR(3),
    city                VARCHAR(50),
    zip_code            VARCHAR(10),
    street_name         VARCHAR(100),
    street_number       SMALLINT,
    address_complements VARCHAR(300),
    is_mod              TINYINT      NOT NULL DEFAULT 0,
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
    product_id           INT AUTO_INCREMENT,
    quantity_stocked     VARCHAR(100) NOT NULL CHECK (quantity_stocked >= 0) DEFAULT 0,
    airflow              VARCHAR(100),
    aspect_ratio         VARCHAR(100),
    autofocus            VARCHAR(100),
    battery_power        VARCHAR(100),
    battery_power_time   VARCHAR(100),
    benefits             VARCHAR(100),
    brand_id             VARCHAR(100) NOT NULL,
    business_oriented    VARCHAR(100),
    camera               VARCHAR(100),
    capacity             VARCHAR(100),
    cellular             VARCHAR(100),
    certification        VARCHAR(100),
    compatibility        VARCHAR(100),
    connectivity         VARCHAR(100),
    cores                VARCHAR(100),
    coverage             VARCHAR(100),
    CPU                  VARCHAR(100),
    cpu_generation       VARCHAR(100),
    curve                VARCHAR(100),
    description          VARCHAR(500) NOT NULL,
    display              VARCHAR(100),
    display_size         VARCHAR(100),
    durability           VARCHAR(100),
    features             VARCHAR(100),
    film_format          VARCHAR(100),
    form_factor          VARCHAR(100),
    functions            VARCHAR(100),
    g_sync_compatible    VARCHAR(100),
    gaming_oriented      VARCHAR(100),
    gps                  VARCHAR(100),
    grade                VARCHAR(100),
    graphics_card        VARCHAR(100),
    id                   VARCHAR(100),
    image                VARCHAR(300),
    interfaces           VARCHAR(100),
    keyboard             VARCHAR(100),
    layout               VARCHAR(100),
    lens_mount           VARCHAR(100),
    lighting             VARCHAR(100),
    materials            VARCHAR(100),
    megapixels           VARCHAR(100),
    microphone           VARCHAR(100),
    name                 VARCHAR(100) NOT NULL,
    noise_cancellation   VARCHAR(100),
    noise_level          VARCHAR(100),
    operating_system     VARCHAR(100),
    options              VARCHAR(100),
    panel_type           VARCHAR(100),
    performance_focus    VARCHAR(100),
    portability          VARCHAR(100),
    power_consumption    VARCHAR(100),
    price                VARCHAR(100) NOT NULL,
    RAM                  VARCHAR(100),
    refresh_rate         VARCHAR(100),
    resolution           VARCHAR(100),
    response_time        VARCHAR(100),
    sales                VARCHAR(100),
    screen_type          VARCHAR(100),
    security_features    VARCHAR(100),
    sensor               VARCHAR(100),
    sensor_resolution    VARCHAR(100),
    sensor_size          VARCHAR(100),
    side_panel           VARCHAR(100),
    size                 VARCHAR(100),
    smart_assistant      VARCHAR(100),
    socket_compatibility VARCHAR(100),
    socket_cpu           VARCHAR(100),
    speed                VARCHAR(100),
    stabilization        VARCHAR(100),
    storage_capacity     VARCHAR(100),
    style                VARCHAR(100),
    switch_type          VARCHAR(100),
    sync_technology      VARCHAR(100),
    target_audience      VARCHAR(100),
    technology           VARCHAR(100),
    touchscreen          VARCHAR(100),
    type_id              VARCHAR(100) NOT NULL,
    uses                 VARCHAR(100),
    video_recording      VARCHAR(100),
    wattage              VARCHAR(100),
    weatherproof         VARCHAR(100),
    weight               VARCHAR(100),
    wifi                 VARCHAR(100),
    wifi_standard        VARCHAR(100),
    zoom                 VARCHAR(100),
    created_at           DATETIME     NOT NULL                               DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     NOT NULL                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id)
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
    date_ordered_at DATETIME                                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          ENUM ('waiting', 'ordered', 'on_the_way', 'delivered') NOT NULL DEFAULT 'waiting',
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE = INNODB;

CREATE TABLE order_items
(
    order_item_id INT AUTO_INCREMENT,
    order_id      INT,
    product_id    INT,
    quantity      SMALLINT NOT NULL,
    PRIMARY KEY (order_item_id),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    INDEX (order_id),
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
    end_date   DATETIME      NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (sale_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    INDEX (product_id),
    CHECK ( end_date > start_date )
) ENGINE = INNODB;

CREATE TABLE tokens
(
    token_id INT AUTO_INCREMENT,
    user_id  INT,
    end_date DATETIME NOT NULL,
    token    VARCHAR(500) UNIQUE,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE = INNODB;

CREATE TABLE password_reset_tokens
(
    token_id INT AUTO_INCREMENT,
    user_id  INT,
    end_date DATETIME NOT NULL,
    token    VARCHAR(500) UNIQUE,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);