import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { getAllProductsDB, getProductsByTagIdDB } from '../api-adapters/products'
import { SingleProductCard } from '../components'

const SearchResults = () => {

    //search-input tag-input
    const [products, setProducts] = useState([])
    const [alert, setAlert] = useState("");

    let {searchInput} = useParams()

    const fetchSearchResults = async () => {

        let filteredProducts = await getAllProductsDB();
        filteredProducts = filteredProducts.products

        filteredProducts = filteredProducts.filter((product) => {
            return (product.name.toLowerCase().includes(searchInput.toLowerCase()))
        })

        setProducts(filteredProducts)

    }

    
    useEffect(() => {

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


{/* THIS IS THE TAGS INPUT */}

          {/* <div className="relative ml-2" ref={refTwo}>

            <Space
              className={`relative peer z-10 flex justify-center pr-10 bg-transparent w-12 h-12 rounded-full border cursor-pointer outline-none pl-12 focus:w-full focus:border-indigo-600 focus:cursor-text focus:pl-16 focus:pr-4 ${visible}`}
              style={{width: "100%"}}
              direction="vertical"
            >
              <div className={`absolute inset-0  ${showDropdown}`}>
                <Select
                  className={`w-full h-full bg-transparent `}
                  style={{
                    width: '100%',
                  }}
                  allowClear
                  placeholder="Please select"
                  onChange={handleChange}
                  options={options}
                />
              </div>
            </Space>


            

            <svg xmlns="http://www.w3.org/2000/svg" 
              className={`absolute inset-y-0 my-auto h-8 w-12 px-3.5 stroke-gray-500 border-r border-transparent peer-focus:border-indigo-600 peer-focus: stroke-indigo-600  ${visible}`} fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                />
            </svg>

          </div> */}


export default SearchResults