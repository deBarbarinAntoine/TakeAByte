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
    quantity_stocked     VARCHAR(500) NOT NULL CHECK (quantity_stocked >= 0) DEFAULT 0,
    airflow              VARCHAR(500),
    aspect_ratio         VARCHAR(500),
    autofocus            VARCHAR(500),
    battery_power        VARCHAR(500),
    battery_power_time   VARCHAR(500),
    benefits             VARCHAR(500),
    brand                VARCHAR(500),
    business_oriented    VARCHAR(500),
    camera               VARCHAR(500),
    capacity             VARCHAR(500),
    cellular             VARCHAR(500),
    certification        VARCHAR(500),
    compatibility        VARCHAR(500),
    connectivity         VARCHAR(500),
    cores                VARCHAR(500),
    coverage             VARCHAR(500),
    CPU                  VARCHAR(500),
    cpu_generation       VARCHAR(500),
    curve                VARCHAR(500),
    description          VARCHAR(500) NOT NULL,
    display              VARCHAR(500),
    display_size         VARCHAR(500),
    durability           VARCHAR(500),
    features             VARCHAR(500),
    film_format          VARCHAR(500),
    form_factor          VARCHAR(500),
    functions             VARCHAR(500),
    g_sync_compatible    VARCHAR(500),
    gaming_oriented      VARCHAR(500),
    gps                  VARCHAR(500),
    grade                VARCHAR(500),
    graphics_card        VARCHAR(500),
    id                   VARCHAR(500),
    image                VARCHAR(500),
    interface            VARCHAR(500),
    keyboard             VARCHAR(500),
    layout               VARCHAR(500),
    lens_mount           VARCHAR(500),
    lighting             VARCHAR(500),
    materials            VARCHAR(500),
    megapixels           VARCHAR(500),
    microphone           VARCHAR(500),
    name                 VARCHAR(500) NOT NULL,
    noise_cancellation   VARCHAR(500),
    noise_level          VARCHAR(500),
    operating_system     VARCHAR(500),
    options              VARCHAR(500),
    panel_type           VARCHAR(500),
    performance_focus    VARCHAR(500),
    portability          VARCHAR(500),
    power_consumption    VARCHAR(500),
    price                VARCHAR(500) NOT NULL,
    RAM                  VARCHAR(500),
    refresh_rate         VARCHAR(500),
    resolution           VARCHAR(500),
    response_time        VARCHAR(500),
    sales                VARCHAR(500),
    screen_type          VARCHAR(500),
    security_features    VARCHAR(500),
    sensor               VARCHAR(500),
    sensor_resolution    VARCHAR(500),
    sensor_size          VARCHAR(500),
    side_panel           VARCHAR(500),
    size                 VARCHAR(500),
    smart_assistant      VARCHAR(500),
    socket_compatibility VARCHAR(500),
    socket_cpu           VARCHAR(500),
    speed                VARCHAR(500),
    stabilization        VARCHAR(500),
    storage_capacity     VARCHAR(500),
    style                VARCHAR(500),
    switch_type          VARCHAR(500),
    sync_technology      VARCHAR(500),
    target_audience      VARCHAR(500),
    technology           VARCHAR(500),
    touchscreen          VARCHAR(500),
    type                 VARCHAR(500),
    uses                 VARCHAR(500),
    video_recording      VARCHAR(500),
    wattage              VARCHAR(500),
    weatherproof         VARCHAR(500),
    weight               VARCHAR(500),
    wifi                 VARCHAR(500),
    wifi_standard        VARCHAR(500),
    zoom                 VARCHAR(500),
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
    quantity      SMALLINT NOT NULL CHECK (quantity > 0) DEFAULT 1,
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