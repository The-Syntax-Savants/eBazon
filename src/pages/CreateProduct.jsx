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
  const [alert, setAlert] = useState("")
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
      const data = await createProductInDB({
        name,
        seller_name,
        description,
        price: price * 100,
        dimensions,
        quantity,
        tags,
        image_url,
      });
      if(data.message){
        setAlert(`Error: ${data.message}`)
      }else{
        navigate("/"); //this will end up taking to single product view
      }
    } catch (err) {
      console.log(err);
      setAlert(`Error: ${err}`)
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
      setAlert(`Image uploaded successfully to: ${data.Location}`);
      return data.Location;
    } catch (error) {
      console.error(`Error uploading image: ${error}`);
      setAlert(`Error uploading image: ${error}`)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen my-[5vh] overflow-hidden">
      <form
        className=""
        onSubmit={async (e) => {
          e.preventDefault();

          const file = e.target.elements.imageInput.files[0];

          if (file.size > MAX_FILE_SIZE) {
            setAlert(
              "Error: File size exceeds the 5 MB limit. Please choose a smaller file."
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
        <div className="hero h-fit w-full bg-base-200">
          <div className="hero-content flex flex-col w-screen">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Create a Listing!</h1>
            </div>
            <div className="card mb-[16vh] flex-shrink-0 w-full max-w-lg h-[60vh] shadow-2xl bg-base-100 overflow-y-auto">
              <div className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
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
                      options={options}
                      onChange={handleChange}
                    />
                  </Space>
                </div>
                <div className="form-control ">
                  <label className="label">
                    <span>Product Image</span>
                  </label>
                    <input
                      type="file"
                      name="imageInput"
                      className="file-input file-input-bordered file-input-info w-full"
                      onChange={(e) => setImage_url(e.target.files[0])}
                    />
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
  //     <form
  //       onSubmit={async (e) => {
  //         e.preventDefault();

  //         const file = e.target.elements.imageInput.files[0];

  //         if (file.size > MAX_FILE_SIZE) {
  //           alert(
  //             "File size exceeds the 5 MB limit. Please choose a smaller file."
  //           );
  //           return;
  //         }
  //         const uploadedImageUrl = await uploadImage(
  //           e.target.elements.imageInput.files[0]
  //         );
  //         setImage_url(uploadedImageUrl);
  //         await updateTagsFunc();
  //       }}
  //     >
  //       <h2>Create Product</h2>
  //       <label className="input-group">
  //         <span>Product Name</span>
  //         <input
  //           required
  //           type="text"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           placeholder="Product Name"
  //           className="input input-bordered"
  //         />
  //       </label>
  //       <label className="input-group">
  //         <span>Product Description</span>
  //         <input
  //           required
  //           type="text"
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           placeholder="Product Description"
  //           className="input input-bordered"
  //         />
  //       </label>
  //       <label className="input-group">
  //         <span>Product Price</span>
  //         <input
  //           required
  //           type="number"
  //           value={price}
  //           onChange={(e) => setPrice(e.target.value)}
  //           placeholder="Product Price"
  //           className="input input-bordered"
  //         />
  //       </label>

  //       <label className="input-group">
  //         <span>Product Category</span>
  //         <Space
  //           className="input input-bordered"
  //           style={{
  //             width: "100%",
  //           }}
  //           direction="vertical"
  //         >
  //           <Select
  //             mode="multiple"
  //             allowClear
  //             style={{
  //               width: "100%",
  //             }}
  //             placeholder="Please select"
  //             onChange={handleChange}
  //             options={options}
  //           />
  //         </Space>
  //       </label>
  //       <label className="input-group">
  //         <span>Product Dimensions</span>
  //         <input
  //           required
  //           type="text"
  //           value={dimensions}
  //           onChange={(e) => setDimensions(e.target.value)}
  //           placeholder="Product Dimensions"
  //           className="input input-bordered"
  //         />
  //       </label>
  //       <label className="input-group">
  //         <span>Product Quantity</span>
  //         <input
  //           required
  //           type="number"
  //           value={quantity}
  //           onChange={(e) => setQuantity(e.target.value)}
  //           placeholder="Product Quantity"
  //           className="input input-bordered"
  //         />
  //       </label>
  //       <label className="input-group">
  //         <span>Product Image</span>
  //         <input
  //           type="file"
  //           name="imageInput"
  //           className="file-input file-input-bordered file-input-info w-full max-w-xs"
  //           onChange={(e) => setImage_url(e.target.files[0])}
  //         />
  //       </label>
  //       <button className="btn btn-primary" type="submit">
  //         Create Product
  //       </button>
  //     </form>
  //   </div>
  // );
};

export default CreateProduct;
