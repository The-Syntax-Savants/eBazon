import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { getAllProductsDB, getProductsByTagIdDB } from '../api-adapters/products'
import { SingleProductCard } from '../components'

const SearchResults = () => {

    //search-input tag-input
    const [products, setProducts] = useState([])
    const [alert, setAlert] = useState("");

    let {searchInput, tagInput} = useParams()

    const fetchSearchResults = async () => {

        //If No tag input
        //If no searchInput
        //If neither input
        //If both inputs

        let filteredProducts = [];

        if(Number(tagInput) === 0 && searchInput.length === 0) {
            
            
            
        } else if (searchInput.length === 0) {
            
            filteredProducts = await getProductsByTagIdDB(tagInput)
            
        } else if(Number(tagInput) === 0) {
            
            filteredProducts = await getAllProductsDB() 
            
        } else {
            
            filteredProducts = await getProductsByTagIdDB(tagInput)
            //.filter with a .includes searchInput


        }
        
        

        // setProducts(filteredProducts)
        
        
    }

    useEffect(() => {
        console.log(searchInput, "searchInput")
        console.log(tagInput, "tagInput")

        fetchSearchResults();

    }, [])

    return (
        <>
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