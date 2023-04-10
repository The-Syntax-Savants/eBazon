import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { getAllProductsDB, getProductsByTagIdDB } from '../api-adapters/products'
import { SingleProductCard } from '../components'
import { getAllTagsDB } from '../api-adapters/tags'

const SearchResults = () => {

    //search-input tag-input
    const [products, setProducts] = useState([])
    const [alert, setAlert] = useState("");
    const [selectedTag, setSelectedTag] = useState(null)
    const [allTags, setAllTags] = useState([])

    let {searchInput} = useParams()

    const fetchSearchResults = async () => {

        let filteredProducts;

        if(selectedTag == null) {

            filteredProducts = await getAllProductsDB()
            filteredProducts = filteredProducts.products

            if (filteredProducts) {
                
                filteredProducts = filteredProducts.filter((product) => {
                    return (product.name.toLowerCase().includes(searchInput.toLowerCase()))
                })
                setProducts(filteredProducts)

            }
            
        } else {


            filteredProducts = await getProductsByTagIdDB(selectedTag);


            if (filteredProducts) {
                
                filteredProducts = filteredProducts.filter((product) => {
                    return (product.name.toLowerCase().includes(searchInput.toLowerCase()))
                })
                
                setProducts(filteredProducts)
            }
    
            
        }



    }

    const fetchAllTags = async () => {

        const fetchedTags = await getAllTagsDB()
        setAllTags(fetchedTags)

    }


    
    useEffect(() => {

        fetchSearchResults();

    }, [selectedTag, searchInput])

    useEffect(() => {

        fetchAllTags()

    }, [])

    return (
        <>

            <div className="flex flex-row justify-center border border-1 border-black">

                {
                    allTags.map((tag) => {
                        return (

                            <button key={`tag name in searchResults map: ${tag.name}`} 
                                value={tag.id}
                                className=" flex justify-center btn-ghost border-solid m-2 border-black border-1  pl-2 pr-2"
                                onClick={(evt) => {
                                    setSelectedTag(evt.target.value)
                                }}
                                >{tag.name}</button>

                        )
                    })
                }
                
            </div>

            <div id="product-cards-container" className="flex flex-wrap">
                {products.map((product) => {
                return (
                    <SingleProductCard
                    product={product}
                    setAlert={setAlert}
                    cardLocation={"home"}
                    key={`This is the key: ${product.id}`}
                    />
                );
                })}
            </div>
        </>
    )

}




export default SearchResults