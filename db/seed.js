import { client } from "./index.js";
import {faker} from "@faker-js/faker"
import { createUser, getAllUsers, getUserById, updateUser } from "./users.js";
import {
  createProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  getProductsByTagId,
  deleteProductByID,
} from "./products.js";
import { createCartProduct, getCartProductsByCartId } from "./cartsProducts.js";
import { createCart, getActiveCartByUsername } from "./carts.js";
import { createTag, getAllTags, deleteTag, editTag } from "./tags.js";
import { addTagsToProduct } from "./productTags.js";

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
            seller_name VARCHAR(50) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
            is_active BOOLEAN DEFAULT true,
            price INTEGER,
            image_url VARCHAR(255),
            description VARCHAR(3000),
            dimensions VARCHAR(255),
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        ); `);

    console.log("creating CARTS table...");
    await client.query(`CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
            is_complete BOOLEAN default false,
            city VARCHAR(50),
            state VARCHAR(50), 
            zipcode VARCHAR(50),
            address_line_1 VARCHAR(50),
            address_line_2 VARCHAR(50),
            price INTEGER,
            time_of_purchase TIMESTAMP DEFAULT NOW()
        ); `);

    console.log("creating CART_PRODUCTS table...");
    await client.query(`CREATE TABLE cart_products(
            id SERIAL PRIMARY KEY,
            cart_id INTEGER REFERENCES carts(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER default 1,
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
            tag_id INTEGER REFERENCES tags(id),
            UNIQUE(product_id, tag_id)
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
    await createUser({
      username: "DrizzyJ",
      password: "password",
      email: "blevins.j921@gmail.com",
      first_name: "Joel",
      last_name: "Blevins",
      is_admin: true,
    });

    await createUser({
      username: "crooney",
      password: "password",
      email: "crooney@info.com",
      first_name: "Charles",
      last_name: "Rooney",
      is_admin: true,
    });

    await createUser({
      username: "Phillip",
      password: "password",
      email: "arkfanatic@info.com",
      first_name: "Andrew",
      last_name: "Conlin",
      is_admin: true,
    });

    await createUser({
      username: "randomTest",
      password: "12345678",
      email: "randomEmail@gmail.com",
      first_name: "random",
      last_name: "Test",
      is_admin: true,
    });

    await createUser({
      username: "topstown",
      password: "12345678",
      email: "topstown56@info.com",
      first_name: "Tops",
      last_name: "Town",
      is_admin: false,
    });

    await createUser({
      username: "Cashing",
      password: "12345678",
      email: "cashingout@info.com",
      first_name: "Cashing",
      last_name: "Out",
      is_admin: false,
    });

    await createUser({
      username: "unforgottable",
      password: "12345678",
      email: "unforgottable@info.com",
      first_name: "mike",
      last_name: "dimes",
      is_admin: false,
    });

    console.log("finished creating initial users!");
  } catch (error) {
    throw error;
  }
}

async function createInitialCartProducts() {
  try {
    console.log("creating initial cart products");
    console.log(
      "Creating first cart product",
      await createCartProduct({
        username: "DrizzyJ",
        product_id: 1,
        quantity: 1,
      })
    );
    console.log("Finished creating initial products");
  } catch (error) {
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("Creating Initial Products...");
    await createProduct({
      name: "MLP Action Figure",
      seller_name: "DrizzyJ",
      price: 1500,
      description: "Priceless Inheritance",
      dimensions: "100x100x100",
      quantity: 1,
    });

    await createProduct({
      name: "Bike",
      seller_name: "DrizzyJ",
      price: 10000,
      description: "This is a bike",
      dimensions: "10x10x10",
      quantity: 10,
    });

    await createProduct({
      name: "Waffle Maker",
      seller_name: "DrizzyJ",
      price: 5000,
      description: "This is a waffle maker",
      dimensions: "10x10x10",
      quantity: 5,
      image_url:
        "https://target.scene7.com/is/image/Target/GUEST_44fc59b0-d3f9-462f-a37b-87ff7372c3c3?wid=488&hei=488&fmt=pjpeg",
    });

    await createProduct({
      name: "Sick Skateboard",
      seller_name: "DrizzyJ",
      price: 15673,
      description: "This is a skateboard. its sick",
      dimensions: "10x100x10",
      quantity: 1,
    });

    await createProduct({
      name: "Camping Tent",
      seller_name: "DrizzyJ",
      price: 20000,
      description:
        "lorem ipsum dolor afnlk al ak an a nal alkas oiqw  now f qonf  fai osfa fsna lfnla nfa falfn aklf na fanl a ",
      dimensions: "10x100x10",
      quantity: 1,
    });

    for(let i = 0; i < 100; i++){
      await createProduct({
        name: faker.commerce.productName(),
        seller_name: faker.helpers.arrayElement(["DrizzyJ", "crooney", "Phillip", "unforgottable", "topstown", "Cashing", "randomTest"]),
        description: faker.lorem.sentence(),
        price: parseInt(parseFloat(faker.commerce.price()) * 100),
        quantity: faker.datatype.number(),
        dimensions: `${faker.datatype.number()} x ${faker.datatype.number()}`,
        image_url: faker.image.imageUrl(null, null, "", true)
      })
    }

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
      await createTag(tags[i]);
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
    await createInitialCartProducts();
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

    console.log("Calling updateUser");
    const object1 = {
      id: 4,
      username: "PolyNoodle",
      first_name: "Emilio",
      email: "d2fan@info.com",
    };
    const MLP = await updateUser(object1);
    console.log("Result:", MLP);

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getAllTags");
    const tags = await getAllTags();
    console.log("Result:", tags);

    console.log("Calling addTagsToProduct");
    const scaryTest = await addTagsToProduct(products[2].id, [
      tags[3],
      tags[2],
      tags[12],
      tags[11],
    ]);
    const scaryTest2 = await addTagsToProduct(products[3].id, [
      tags[3],
      tags[12],
      tags[11],
    ]);
    console.log("This function doesn't return anything by intention. It works");

    console.log("Calling getProductById");
    const product = await getProductByID(products[2].id);
    const product2 = await getProductByID(products[3].id);
    console.log("Result1:", product);
    console.log("Result2:", product2);

    console.log("Calling getProductsByTagId");
    const filteredProducts = await getProductsByTagId(4);
    console.log("Result: ", filteredProducts);

    console.log("Testing create product with tags");
    const create = await createProduct({
      name: "newProductICreated",
      seller_name: "DrizzyJ",
      price: 2700,
      description: "Priceless Inheritance",
      dimensions: "100x100x100",
      quantity: 1,
      tags: product.tags,
    });
    console.log("Result:", create);

    console.log("testing updateProduct");
    console.log(
      await updateProduct(create.id, {
        name: "why now",
        seller_name: "PolyNoodle",
        price: 27770,
        description: "Priceless Inheritance",
        dimensions: "100x100x100",
        quantity: 1,
        tags: product.tags,
      })
    );

    console.log("testing getCartProductByCartId");
    const data = await getCartProductsByCartId(1);
    console.log("Result:", data);

    // console.log("testing deleteProductById")
    // await deleteProductByID(create.id)

    // console.log("Calling deleteTag")
    // await deleteTag(tags[1].id)
    // console.log("Result", await getAllTags())

    // console.log("Calling editTag")
    // const test = await editTag(tags[0].id, "books")
    // console.log("Result:", test, await getAllTags())
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
