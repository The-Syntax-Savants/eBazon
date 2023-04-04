const { client } = require(".")
const { getProductByID } = require("./products")


async function createProductTag(productId, tagId){
    try {
        await client.query(`
            INSERT INTO product_tags(product_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT (product_id, tag_id) DO NOTHING;
        `, [productId, tagId])
    } catch (error) {
        console.log("Error in createProductTag")
        throw error
    }
}

async function addTagsToProduct(productId, tagList){
    try {
        const createProductTagPromises = tagList.map((tag) =>
            createProductTag(productId, tag.id)
        )

        await Promise.all(createProductTagPromises)

        // return await getProductByID(productId)
    } catch (error) {
        console.log("Error in createProductTag")
        throw error
    }
}

module.exports = {
    addTagsToProduct,
}