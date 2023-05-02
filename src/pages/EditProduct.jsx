import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { editProductInDB, getProductByIdDB } from "../api-adapters/products";
import { getAllTagsDB } from "../api-adapters/tags";
import { Select, Space } from "antd";

const EditProduct = () => {
  const { id } = useParams();

  //Would be cool if instead of a bunch of different states, or a single state for each section, we could have a "user" state that is an object containing all these
  //  other states as keys inside of it. That way we dont got a clump of state definitions and only got 1. -Emilio

  const [product, setProduct] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [values, setValues] = useState([]);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const options = [];
  const tagsWithValue = [];

  const fetchProduct = async () => {
    const data = await getProductByIdDB(id);
    if (data.product) {
      setName(data.product.name);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setDimensions(data.product.dimensions);
      setQuantity(data.product.quantity);

      setProduct(data.product);
    } else {
      setAlert(`Error: ${data.message}`);
    }
  };

  allTags.map((tag) => {
    options.push({
      label: tag.name,
      value: tag.id,
    });
  });

  const handleChange = (value) => {
    setValues(value);
  };

  const tagGrabber = async () => {
    const data = await getAllTagsDB(localStorage.getItem("token"));
    setAllTags(data);
    console.log(data);
  };

  useEffect(() => {
    if (!name) {
      fetchProduct();
    }
    tagGrabber();
    if (tags.length || name.length) {
      editProduct();
    }
  }, [tags]);

  const updateTagsFunc = async () => {
    values.map((tagID) => {
      tagsWithValue.push({ id: tagID });
    });

    setTags(tagsWithValue);
  };

  const editProduct = async () => {
    try {
      await editProductInDB({
        id,
        name,
        description,
        price: price * 100,
        dimensions,
        quantity,
        is_active: isActive,
        tags,
      });

      navigate("/"); //this will end up taking to single product view
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // const handleFileChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

  return (
    <div className="flex flex-col items-center justify-center h-fit w-[97vw] my-[5vh]">
      {product && (
        <form
          className=""
          onSubmit={async (e) => {
            e.preventDefault();
            await updateTagsFunc();
          }}
        >
          <div className="hero h-fit w-full">
            <div className="hero-content flex flex-col w-screen">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Edit Product!</h1>
              </div>
              <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      className="input input-bordered"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input
                      type="text"
                      value={description}
                      className="input input-bordered"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price</span>
                    </label>
                    <input
                      type="number"
                      placeholder={price / 100}
                      // value={price / 100}
                      className="input input-bordered"
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Dimensions</span>
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      className="input input-bordered"
                      onChange={(e) => {
                        setDimensions(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Quantity</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      className="input input-bordered"
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tags</span>
                    </label>
                    <Space
                      className="input input-bordered flex justify-center"
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
                  </div>
                  <div className="form-control mt-6">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {alert.startsWith("Error") ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert}</span>
          </div>
        </div>
      ) : alert ? (
        <div className="alert alert-success shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert}</span>
          </div>
        </div>
      ) : null}
    </div>
  );

  // return (
  //   <div>
  //     {product && (
  //       <form
  //         onSubmit={async (e) => {
  //           e.preventDefault();
  //           await updateTagsFunc();
  //         }}
  //       >
  //         <h2>Create Product</h2>
  //         <label className="input-group">
  //           <span>Product Name</span>
  //           <input
  //             required
  //             type="text"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             className="input input-bordered"
  //           />
  //         </label>
  //         <label className="input-group">
  //           <span>Product Description</span>
  //           <input
  //             required
  //             type="text"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //             className="input input-bordered"
  //           />
  //         </label>
  //         <label className="input-group">
  //           <span>Product Price</span>
  //           <input
  //             required
  //             type="number"
  //             value={price}
  //             onChange={(e) => setPrice(e.target.value)}
  //             className="input input-bordered"
  //           />
  //         </label>

  //         <label className="input-group">
  //           <span>Product Category</span>
  //           <Space
  //             className="input input-bordered"
  //             style={{
  //               width: "100%",
  //             }}
  //             direction="vertical"
  //           >
  //             <Select
  //               mode="multiple"
  //               allowClear
  //               style={{
  //                 width: "100%",
  //               }}
  //               placeholder="Please select"
  //               onChange={handleChange}
  //               options={options}
  //             />
  //           </Space>
  //         </label>
  //         <label className="input-group">
  //           <span>Product Dimensions</span>
  //           <input
  //             required
  //             type="text"
  //             value={dimensions}
  //             onChange={(e) => setDimensions(e.target.value)}
  //             className="input input-bordered"
  //           />
  //         </label>
  //         <label className="input-group">
  //           <span>Product Quantity</span>
  //           <input
  //             required
  //             type="number"
  //             value={quantity}
  //             onChange={(e) => setQuantity(e.target.value)}
  //             className="input input-bordered"
  //           />
  //         </label>
  //         <label className="input-group">
  //           <span>Product Image</span>
  //           <input
  //             type="file"
  //             className="file-input file-input-bordered file-input-info w-full max-w-xs"
  //             // onChange={handleFileChange}
  //           />
  //         </label>
  //         <button className="btn btn-primary" type="submit">
  //           Edit Product
  //         </button>
  //       </form>
  //     )}
  //   </div>
  // );
};

export default EditProduct;
