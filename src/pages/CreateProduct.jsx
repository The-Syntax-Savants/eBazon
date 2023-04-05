import React, { useEffect, useState } from "react";
import { createProductInDB } from "../api-adapters/products";
import { getAllTagsDB } from "../api-adapters/tags";
import { Select, Space } from "antd";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");
  let values = [];

  const options = [];
  const tagsWithValue = [];
  allTags.map((tag) => {
    options.push({
      label: tag.name,
      value: tag.id,
    });
  });

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    values = value;
  };

  const tagGrabber = async () => {
    const data = await getAllTagsDB(localStorage.getItem("token"));
    setAllTags(data);
    console.log(data);
  };

  useEffect(() => {
    tagGrabber();
  }, []);

  const createProduct = async () => {
    try {
      const seller_name = localStorage.getItem("username");

      console.log("Sending product to db...");
      console.log(values, "VALUES");
      const tagValues = values.map((tagID) => {
        tagsWithValue.push({ id: tagID });
      });

      console.log(tagsWithValue);

      // tagsWithValue.push()
      const data = await createProductInDB({
        name,
        seller_name,
        description,
        price,
        dimensions,
        quantity,
        selectedTags,
      });
      console.log(data, "createProduct response");
      return data;
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct();
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
            placeholder="Product Name"
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
            placeholder="Product Description"
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
            placeholder="Product Price"
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
            placeholder="Product Dimensions"
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Quantity</span>
          <input
            required
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Product Quantity"
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
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
