import { client } from "./index.js";
import { faker } from "@faker-js/faker";
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
import { createMessage, createOffer, getAllUnreadMessagesByUsername, getConversationBetweenUsersForProduct, setMessageToRead } from "./messages.js";

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
            DROP TABLE IF EXISTS messages;
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

    console.log("creating MESSAGES table...")
    await client.query(`
      CREATE TABLE messages(
        id SERIAL PRIMARY KEY,
        sender_name VARCHAR(50) NOT NULL REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
        receiver_name VARCHAR(50) NOT NULL REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        message TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT NOW(),
        read_at TIMESTAMP,
        is_offer BOOLEAN DEFAULT false,
        offer_price INTEGER,
        offer_status VARCHAR(20) DEFAULT 'pending'
      );
    `)

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

    console.log("creating TAGS table...");
    await client.query(`CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );`);

    console.log("creating PRODUCT_TAGS table...");
    await client.query(`CREATE TABLE product_tags(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
            tag_id INTEGER REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
            UNIQUE(product_id, tag_id)
        );`);

    console.log("creating USER_REVIEWS table...");
    await client.query(`CREATE TABLE user_reviews(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            description VARCHAR(3000) NOT NULL,
            star_rating INTEGER NOT NULL,
            reviewer_name VARCHAR(50) REFERENCES users(username) 
        );`);

    console.log("creating PRODUCT_REVIEWS table...");
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
    console.log("Creating Initial Products");

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

    console.log("Finished creating initial products");
  } catch (error) {
    console.log("Failed to create initial products!");
    throw error;
  }
}

async function createInitialTags() {
  try {
    console.log("Starting to create tags AND More Users with carts......");

    const tags = [
      "Jewelry",
      "Books",
      "Decoration",
      "Home Goods",
      "Electronics",
      "Clothing",
      "Gaming",
      "Home DIY",
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

    const data = await getAllTags();
    console.log(data, "HERE AGAUIN");

    for (let i = 1; i < 100; i++) {
      const tag = [
        data[faker.datatype.number({ min: 1, max: 7 })],
        data[faker.datatype.number({ min: 8, max: 15 })],
      ];
      await createProduct({
        name: faker.commerce.productName(),
        seller_name: faker.helpers.arrayElement([
          "DrizzyJ",
          "crooney",
          "Phillip",
          "unforgottable",
          "topstown",
          "Cashing",
          "randomTest",
        ]),
        description: faker.lorem.sentence(),
        price: parseInt(parseFloat(faker.commerce.price()) * 100),
        quantity: faker.datatype.number(),
        dimensions: `${faker.datatype.number()} x ${faker.datatype.number()}`,
        image_url: faker.image.imageUrl(null, null, "technic", true),
        tags: tag,
      });
      const first_name = faker.name.firstName();
      const username = faker.internet.userName(first_name);
      await createUser({
        first_name: first_name,
        last_name: faker.name.lastName(),
        username: username,
        password: "password",
        email: faker.internet.email(first_name),
        is_admin: false,
      });

      await createCartProduct({
        username: username,
        product_id: i,
        quantity: faker.datatype.number({ max: 10 }),
      });
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
    const updateUserTest = await updateUser(object1);
    console.log("Result:", updateUserTest);

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

    // console.log("Testing create product with tags");
    // const create = await createProduct({
    //   name: "newProductICreated",
    //   seller_name: "DrizzyJ",
    //   price: 2700,
    //   description: "Priceless Inheritance",
    //   dimensions: "100x100x100",
    //   quantity: 1,
    //   tags: product.tags,
    // });
    // console.log("Result:", create);

    // console.log("testing updateProduct");
    // console.log(
    //   await updateProduct(create.id, {
    //     name: "why now",
    //     seller_name: "PolyNoodle",
    //     price: 27770,
    //     description: "Priceless Inheritance",
    //     dimensions: "100x100x100",
    //     quantity: 1,
    //     tags: product.tags,
    //   })
    // );

    console.log("testing getCartProductByCartId");
    const data = await getCartProductsByCartId(1);
    console.log("Result:", data);

    console.log("testing CreateMessage")
    const message1 = await createMessage({
      senderName: "crooney",
      receiverName: "DrizzyJ",
      productId: 60,
      messageText: "this is a test message",
    })
    await createMessage({
      senderName: "DrizzyJ",
      receiverName: "crooney",
      productId: 60,
      messageText: "glad it worked",
    })
    await createMessage({
      senderName: "crooney",
      receiverName: "DrizzyJ",
      productId: 60,
      messageText: "me too man, this is amazing",
    })
    console.log("Result", message1)

    console.log("testing getConversationFromUsersByProduct")
    const conversation = await getConversationBetweenUsersForProduct({
      user1Name: "crooney",
      user2Name: "DrizzyJ",
      productId: 60,
    })
    console.log("Result", conversation)

    
    // console.log("testing setMessageToRead")
    // const readTest = await setMessageToRead(3)
    // console.log("Result:", readTest)
    
    console.log("testing getAllUnreadMessagesByUsername")
    const unread = await getAllUnreadMessagesByUsername("DrizzyJ")
    console.log("Result:", unread)

    console.log("testing createOffer")
    const offer = await createOffer({
      senderName: "crooney",
      receiverName: "DrizzyJ", 
      productId: 60,
      messageText: "I would like to offer your $100 for this item",
      offerPrice: (100 * 100),
  })
  console.log("Result:", offer)


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
