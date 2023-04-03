import React, { useState } from "react";
import { createProductDB } from "../api-adapters";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [seller, setSeller] = useState("");

  const createProduct = async () => {
    const data = await createProductDB({
      name,
      description,
      price,
      image,
      category,
      seller,
    });
  };
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
            placeholder="Product Name"
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Description</span>
          <input
            required
            type="text"
            placeholder="Product Description"
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Price</span>
          <input
            required
            type="number"
            placeholder="Product Price"
            className="input input-bordered"
          />
        </label>

        <label className="input-group">
          <span>Product Category</span>
          <select name="Category" className="input input-bordered">
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
            placeholder="Product Dimensions"
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Quantity</span>
          <input
            required
            type="text"
            placeholder="Product Quantity"
            className="input input-bordered"
          />
        </label>
        <label className="input-group">
          <span>Product Image</span>
          <input
            type="file"
            className="file-input file-input-bordered file-input-info w-full max-w-xs"
          />
        </label>
        <button className="btn btn-primary" onClick={createProduct}>
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
