import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { editProductInDB, getProductByIdDB } from "../api-adapters/products";
import { getAllTagsDB } from "../api-adapters/tags";
import { Select, Space } from "antd";

const EditProduct = () => {
  const {id} = useParams()
  const [product, setProduct] = useState({})
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
const [values, setValues] = useState([]);
const navigate = useNavigate()

const options = [];
const tagsWithValue = [];
  
  const fetchProduct = async () => {
    const data = await getProductByIdDB(id)
    if(data.product){
        setName(data.product.name)
        setDescription(data.product.description)
        setPrice(data.product.price)
        setDimensions(data.product.dimensions)
        setQuantity(data.product.quantity)
        
        setProduct(data.product)
    }
  } 


  allTags.map((tag) => {
    options.push({
      label: tag.name,
      value: tag.id,
    });
  });

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setValues(value);
  };

  const tagGrabber = async () => {
    const data = await getAllTagsDB(localStorage.getItem("token"));
    setAllTags(data);
    console.log(data);
  };

  useEffect(() => {
    if(!name){
      fetchProduct()
    }
    tagGrabber();
    if(tags.length || name.length){
      editProduct()
    }
  }, [tags]);

  const updateTagsFunc = async () => {
    values.map((tagID) => {
      tagsWithValue.push({ id: tagID });
    });
  
    setTags(tagsWithValue)

  }

  const editProduct = async () => {
    try {
    


      await editProductInDB({
        id,
        name,
        description,
        price,
        dimensions,
        quantity,
        is_active: isActive,
        tags,
    });

      navigate("/")//this will end up taking to single product view
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // const handleFileChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

  return (
    <div>
      {product && <form
        onSubmit={async (e) => {
          e.preventDefault();
          await updateTagsFunc()
        }}
      >
        <h2>Create Product</h2>
        <label className="input-group">
          <span>Product Name</span>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Description</span>
          <input
            required
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Price</span>
          <input
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered"
          />
        </label>

        <label className="input-group">
          <span>Product Category</span>
          <Space
            className="input input-bordered"
            style={{
              width: "100%",
            }}
            direction="vertical"
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              onChange={handleChange}
              options={options}
            />
          </Space>
        </label>
        <label className="input-group">
          <span>Product Dimensions</span>
          <input
            required
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Quantity</span>
          <input
            required
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Image</span>
          <input
            type="file"
            className="file-input file-input-bordered file-input-info w-full max-w-xs"
            // onChange={handleFileChange}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Edit Product
        </button>
      </form>}
    </div>
  );
};

export default EditProduct;
