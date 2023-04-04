const { client } = require(".")
const {getProductById} = require("./products")

async function createProductTag(productId, tagId){
    try {
        await client.query(`
            INSERT INTO product_tags("productId", "tagId")
            VALUES ($1, $2)
            ON CONFLICT ("productId", "tagId") DO NOTHING
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

        return await getProductById(productId)
    } catch (error) {
        console.log("Error in addTagsToProduct")
        throw error
    }
}

module.exports = {
    addTagsToProduct,
}