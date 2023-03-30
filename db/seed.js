const {client} = require("./index")
const {createUser, getAllUsers, getUserById} = require("./users")

async function dropTables(){
    try {
        console.log("Starting to drop tables...")
        await client.query(`
            DROP TABLE IF EXISTS product_reviews;
            DROP TABLE IF EXISTS user_reviews;
            DROP TABLE IF EXISTS product_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS cart_products;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `)
    } catch (error) {
        console.error("Error dropping tables!")
        throw error
    }

}

async function createTables(){
    console.log("Starting to create tables....")
    try{
        console.log("creating USERS table...")
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            address_line_1 VARCHAR(50),
            address_line_2 VARCHAR(50),
            city VARCHAR(3000),
            state BOOLEAN DEFAULT false,
            zipcode VARCHAR(50),
            about VARCHAR(3000),
            is_admin BOOLEAN DEFAULT false,
            profile_picture VARCHAR(255),
            active BOOLEAN DEFAULT true
        ); `)
        console.log("creating PRODUCTS table...")
        await client.query(`CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            seller_name VARCHAR(50) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            price INTEGER NOT NULL,
            images VARCHAR(255)[],
            description VARCHAR(3000),
            dimensions VARCHAR(255),
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        ); `)
        
        console.log("creating CARTS table...")
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
        ); `)
        
        console.log("creating CART_PRODUCTS table...")
        await client.query(`CREATE TABLE cart_products(
            id SERIAL PRIMARY KEY,
            cart_id INTEGER REFERENCES carts(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER,
            price INTEGER
        ); `)

        console.log(`creating TAGS table...`)
        await client.query(`CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );`)
        
        console.log(`creating PRODUCT_TAGS table...`)
        await client.query(`CREATE TABLE product_tags(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            tag_id INTEGER REFERENCES tags(id)
        );`)

        console.log(`creating USER_REVIEWS table...`)
        await client.query(`CREATE TABLE user_reviews(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            description VARCHAR(3000) NOT NULL,
            star_ratin INTEGER NOT NULL,
            reviewer_name VARCHAR(50) REFERENCES users(username) 
        );`)
        
        console.log(`creating PRODUCT_REVIEWS table...`)
        await client.query(`CREATE TABLE product_reviews(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            description VARCHAR(2000) NOT NULL,
            star_rating INTEGER NOT NULL,
            reviewer_name VARCHAR(50) REFERENCES users(username)
        )`)

        console.log("Finished building tables")
    }
    catch (error){
        console.error("Error building tables!")
        throw error
    }

}

async function createInitialUsers(){
    try {
        console.log("starting to create initial users")
        const joel = createUser({
            username: "DrizzyJ",
            password: "password",
            email: "blevins.j921@gmail.com",
            first_name: "Joel",
            last_name: "Blevins"
        })

        const random = createUser({
            username: "randomTest",
            password: "12345678",
            email: "randomEmail@gmail.com",
            first_name: "random",
            last_name: "Test"
        })

        console.log("finished creating initial users!")
    } catch (error) {
        throw error
    }
}

async function createInitialProducts(){
    try{

    }
    catch{

    }
}

async function rebuildDB() {
    try {
        client.connect()
        await dropTables()
        await createTables()
        await createInitialUsers()
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...")

        console.log("Getting all users")
        const users = await getAllUsers()
        console.log("Result:", users)

        console.log("Calling getUserById")
       const firstUser = await getUserById(users[0].id)
        console.log("Result:", firstUser)

    } catch (error) {
        console.log("Error during testDB")
        throw error
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())