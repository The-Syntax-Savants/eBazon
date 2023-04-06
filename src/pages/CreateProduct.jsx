import React, { useEffect, useState } from "react";
import { createProductInDB } from "../api-adapters/products";
import { getAllTagsDB } from "../api-adapters/tags";
import { Select, Space } from "antd";
import { useNavigate } from "react-router";

//
class FormState {
  /**
   * @param options { { name?: string, seller_name?: string } }
   */
  constructor(options) {
    this.name = options.name;
    this.seller_name = options.seller_name;
    this.description = options.description;
    this.price = options.price;
    this.dimensions = options.dimensions;
    this.quantity = options.quantity;
    this.tags = options.tags;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (typeof value === "string") {
      this._name = value;
    }
  }

  get tags() {
    return this._tags;
  }

  set tags(value) {
    if (Array.isArray(value)) {
      this._tags = value;
    }
  }

  /**
   * @returns {boolean}
   */
  validate() {
    if (!this.name || !this.seller_name)
      throw new Error("Missing field(s) for form submission!");
    return true;
  }

  /**
   * @return {{name: string, seller_name: string}}
   */
  toObject() {
    return {
      name: this.name,
      seller_name: this.seller_name,
    };
  }
}

const CreateProduct = () => {
  // replace state with getters and setters in class
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  // Fetched list of tags from DB
  const [tags, setTags] = useState([]);
  // Tags rendered as options
  const [tagsAsOptions, setTagsAsOptions] = useState([]);
  // UNUSED
  // const [allTags, setAllTags] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");
  const [values, setValues] = useState([]);

  // MAIN FORMSTATE OBJECT
  // UPDATE ME INSTEAD OF INDIVIDUAL FIELDS, i.e. get rid of price, setPrice useStates -> get/set on FormState
  const [formState, setFormState] = useState(
    new FormState({
      name: "",
    })
  );
  const tagsWithValue = [];
  const navigate = useNavigate();

  const onTagsSelectChange = (event) => {
    formState.tags = event.target.value;
  };

  // On component mount, fetch tags from API. Update tags with response
  useEffect(() => {
    const data = (() =>
      getAllTagsDB(localStorage.getItem("token")).then((res) => {
        console.log(`response from api: ${JSON.stringify(res)}`);
        if (Array.isArray(res)) {
          const formattedTags = res.reduce((tags, tag) => {
            return [
              ...tags,
              {
                label: tag.name,
                value: tag.id,
              },
            ];
          }, []);
          setTagsAsOptions(formattedTags);
        }
        setTags(res);
        console.log();
        return res;
      }))();
    console.log(`Updated tags with data: ${JSON.stringify(data)}`);
  }, []);

  // Log whenever tags have changed
  useEffect(() => {
    console.log("Updated tags: ", tags);
  }, [tags]);

  // When formState changes, log it and validate
  useEffect(() => {
    console.log(formState.validate());
  }, [formState]);

  // On submit, convert formState to object and submit to createProduct
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!formState.validate()) {
      throw new Error("Form state is invalid!");
    }
    const submissionData = formState.toObject();
    await createProduct(submissionData);
  };

  /**
   * Takes formState data and submits it to API
   * @param submissionData {{name: string, seller_name: string}}
   */
  const createProduct = async (submissionData) => {
    try {
      const seller_name = localStorage.getItem("username");

      console.log(price);

      await createProductInDB({
        // fromState.name etc.
        name: submissionData.name,
        seller_name: submissionData.seller_name,
        description,
        price: price * 100,
        dimensions,
        quantity,
        tags,
      }).then((res) => {
        console.log(`POST /createProduct res: ${JSON.stringify(res)}`);
      });

      navigate("/"); //this will end up taking to single product view
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitForm}>
        <h2>Create Product</h2>
        <label className="input-group">
          <span>Product Name</span>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => {
              formState.name = e.target.value;
            }}
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
              onChange={onTagsSelectChange}
              options={tagsAsOptions}
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
