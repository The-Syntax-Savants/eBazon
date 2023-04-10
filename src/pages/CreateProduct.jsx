import React, { useEffect, useState } from "react";
import { createProductInDB } from "../api-adapters/products";
import { getAllTagsDB } from "../api-adapters/tags";
import { Select, Space } from "antd";
import { useNavigate } from "react-router";
import s3 from "../../aws.config.js";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image_url, setImage_url] = useState(null);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");
  const [values, setValues] = useState([]);
  const navigate = useNavigate();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
    setValues(value);
  };

  const tagGrabber = async () => {
    const data = await getAllTagsDB(localStorage.getItem("token"));
    setAllTags(data);
    console.log(data);
  };

  useEffect(() => {
    tagGrabber();
    if (tags.length && typeof image_url === "string") {
      createProduct();
    }
  }, [tags, image_url]);

  const updateTagsFunc = async () => {
    values.map((tagID) => {
      tagsWithValue.push({ id: tagID });
    });

    setTags(tagsWithValue);
  };

  const createProduct = async () => {
    try {
      const seller_name = localStorage.getItem("username");
      console.log(price);
      await createProductInDB({
        name,
        seller_name,
        description,
        price: price * 100,
        dimensions,
        quantity,
        tags,
        image_url,
      });

      navigate("/"); //this will end up taking to single product view
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const uploadImage = async (file) => {
    const params = {
      Bucket: "ebazonimages",
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };
    try {
      const data = await s3.upload(params).promise();
      console.log(`Image uploaded successfully to: ${data.Location}`);
      return data.Location;
    } catch (error) {
      console.error(`Error uploading image: ${error}`);
      return null;
    }
  };

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const file = e.target.elements.imageInput.files[0];

          if (file.size > MAX_FILE_SIZE) {
            alert(
              "File size exceeds the 5 MB limit. Please choose a smaller file."
            );
            return;
          }
          const uploadedImageUrl = await uploadImage(
            e.target.elements.imageInput.files[0]
          );
          setImage_url(uploadedImageUrl);
          await updateTagsFunc();
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
            type="number"
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
            name="imageInput"
            className="file-input file-input-bordered file-input-info w-full max-w-xs"
            onChange={(e) => setImage_url(e.target.files[0])}
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
