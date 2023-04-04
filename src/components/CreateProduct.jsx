import React, { useState } from "react";
import { createProductInDB } from "../api-adapters/products";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [seller, setSeller] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");

  const createProduct = async () => {
    const data = await createProductInDB({
      name,
      description,
      price,
      category,
      seller,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={handleFileChange}
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
