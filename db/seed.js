const { client } = require("./index");
const { createUser, getAllUsers, getUserById } = require("./users");
const { createProduct, getAllProducts } = require("./products");
const { createTag, getAllTags, getTagsByProductTag } = require("./tags");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
            DROP TABLE IF EXISTS product_reviews;
            DROP TABLE IF EXISTS user_reviews;
            DROP TABLE IF EXISTS product_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS cart_products;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  console.log("Starting to create tables....");
  try {
    console.log("creating USERS table...");
    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            address_line_1 VARCHAR(50),
            address_line_2 VARCHAR(50),
            city VARCHAR(3000),
            state VARCHAR(50),
            zipcode VARCHAR(50),
            about VARCHAR(3000),
            is_admin BOOLEAN DEFAULT false,
            profile_picture BYTEA,
            active BOOLEAN DEFAULT true
        ); `);
    console.log("creating PRODUCTS table...");
    await client.query(`CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            seller_name VARCHAR(50) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            price INTEGER,
            images BYTEA,
            description VARCHAR(3000),
            dimensions VARCHAR(255),
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        ); `);

    console.log("creating CARTS table...");
    await client.query(`CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) REFERENCES users(username),
            is_complete BOOLEAN default false,
            city VARCHAR(50) NOT NULL,
            state VARCHAR(50) NOT NULL, 
            zipcode VARCHAR(50) NOT NULL,
            address_line_1 VARCHAR(50) NOT NULL,
            address_line_2 VARCHAR(50),
            price INTEGER NOT NULL,
            time_of_purchase TIMESTAMP DEFAULT NOW()
        ); `);

    console.log("creating CART_PRODUCTS table...");
    await client.query(`CREATE TABLE cart_products(
            id SERIAL PRIMARY KEY,
            cart_id INTEGER REFERENCES carts(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER,
            price INTEGER
        ); `);

    console.log(`creating TAGS table...`);
    await client.query(`CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );`);

    console.log(`creating PRODUCT_TAGS table...`);
    await client.query(`CREATE TABLE product_tags(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            tag_id INTEGER REFERENCES tags(id)
        );`);

    console.log(`creating USER_REVIEWS table...`);
    await client.query(`CREATE TABLE user_reviews(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            description VARCHAR(3000) NOT NULL,
            star_rating INTEGER NOT NULL,
            reviewer_name VARCHAR(50) REFERENCES users(username) 
        );`);

    console.log(`creating PRODUCT_REVIEWS table...`);
    await client.query(`CREATE TABLE product_reviews(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            description VARCHAR(2000) NOT NULL,
            star_rating INTEGER NOT NULL,
            reviewer_name VARCHAR(50) REFERENCES users(username)
        )`);

    console.log("Finished building tables");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("starting to create initial users");
    const joel = await createUser({
      username: "DrizzyJ",
      password: "password",
      email: "blevins.j921@gmail.com",
      first_name: "Joel",
      last_name: "Blevins",
      is_admin: true
    });

    const random = await createUser({
      username: "randomTest",
      password: "12345678",
      email: "randomEmail@gmail.com",
      first_name: "random",
      last_name: "Test",
      is_admin: false
    });

    console.log("finished creating initial users!");
  } catch (error) {
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("Creating Initial Products...");
    createProduct({
      name: "MLP Action Figure",
      seller_name: "DrizzyJ",
      price: 1500,
      description: "Priceless Inheritance",
      dimensions: "100x100x100",
      quantity: 1,
    });

    createProduct({
      name: "Bike",
      seller_name: "DrizzyJ",
      price: 10000,
      description: "This is a bike",
      dimensions: "10x10x10",
      quantity: 10,
    });

    createProduct({
      name: "Waffle Maker",
      seller_name: "DrizzyJ",
      price: 5000,
      description: "This is a waffle maker",
      dimensions: "10x10x10",
      quantity: 5,
    });

    createProduct({
      name: "Sick Skateboard",
      seller_name: "DrizzyJ",
      price: 15673,
      description: "This is a skateboard. its sick",
      dimensions: "10x100x10",
      quantity: 1,
    });
    createProduct({
      name: "Camping Tent",
      seller_name: "DrizzyJ",
      price: 20000,
      description:
        "lorem ipsum dolor afnlk al  ak an a nal alkas oiqw  now f qonf  fai osfa fsna lfnla nfa falfn aklf na fanl a ",
      dimensions: "10x100x10",
      quantity: 1,
    });

    console.log("Finished creating initial products");
  } catch (error) {
    console.log("Failed to create initial products!");
    throw error;
  }
}

async function createInitialTags() {
  try {
    console.log("Starting to create tags...");

    let tags = [
      "Jewelry",
      "Books",
      "Decoration",
      "Home Goods",
      "Electronics",
      "Clothing",
      "Gaming",
      "Home Improvement",
      "Handmade",
      "Collectibles",
      "Sports",
      "Toys",
      "Outdoors",
      "Accessories",
      "Shoes",
      "Miscellaneous",
    ];

    for (let i = 0; i < tags.length; i++) {
      createTag(tags[i]);
    }

    console.log("Finished creating tags");
  } catch (error) {
    console.log("Failed to create initial tags");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialTags();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Getting all users");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling getUserById");
    const firstUser = await getUserById(users[0].id);
    console.log("Result:", firstUser);

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getAllTags");
    const tags = await getAllTags();
    console.log("Result:", tags);
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
