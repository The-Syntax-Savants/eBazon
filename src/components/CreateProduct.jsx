import React, { useState } from "react";
import { createProductDB } from "../api-adapters";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");

  const createProduct = async () => {
    console.log("Creating product...");
    try {
      const seller_name = localStorage.getItem("username");
      console.log("Sending product to db...");
      console.log(name,
        seller_name,
        description,
        price,
        dimensions,
        quantity,
        tags, "!!!")
      const data = await createProductDB({
        name,
        seller_name,
        description,
        price,
        dimensions,
        quantity,
        tags,
      });
      console.log(data, "###");
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
          <select
            name="Category"
            className="input input-bordered"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          >
            <option value="volvo">Test</option>
            <option value="saab">Test2</option>
            <option value="mercedes">Test3</option>
          </select>
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
