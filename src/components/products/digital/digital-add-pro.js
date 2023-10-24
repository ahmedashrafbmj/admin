import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import MyDropzone from "../../common/dropzone";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import baseurl from "../../../assets/baseurl/baseurl";
import { toast } from "react-toastify";

const Digital_add_pro = () => {
  // const [value, setValue] = useState('')
  const [cat, setResCategory] = useState();
  const [brands, setResBrands] = useState();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState([]);
  const [file, setFile] = useState(null);
  console.log(typeof file, "fileeeeee");

  console.log(selectedBrands, "selectedBrands");

  const handleFileChange = (e) => {
    console.log(e, "parameter");

    // const filesArray = Array.from(e.target.files);
    setFile(e.target.files);
    // if (file) {
    //   const reader = new FileReader();

    //   reader.onload = (e) => {
    // 	const binaryData = e.target.result; // Binary data as ArrayBuffer
    // 	// Do something with the binary data, for example, send it to a server or process it in your component
    //   };

    //   reader.readAsArrayBuffer(file); // Start reading the file as ArrayBuffer
    // }
  };
  const [inputValue, setInputValue] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    menuProductNumber: "",
    totalUnits: "",
    shortDescription: "",
    longDescription: "",
    ProductLink: "",
  });
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // const [selectedCategories, setSelectedCategories] = useState([]);

  console.log(inputValue, "inputValue");
  const handleFormSubmit = async () => {
    // Create a FormData object and append the file to it
    const formData = new FormData();
    // formData.append('images', file);

    formData.append("name", inputValue.name);
    formData.append("price", inputValue.price);
    formData.append("discountedPrice", inputValue.discountedPrice);
    formData.append("menuProductNumber", inputValue.menuProductNumber);
    formData.append("shortDescription", inputValue.shortDescription);
    formData.append("totalUnits", inputValue.totalUnits);
    formData.append("ProductLink", inputValue.ProductLink);
    formData.append("longDescription", inputValue.longDescription);
    SelectedCategory.map((e, i) => formData.append(`category[${i}]`, e._id));
    selectedBrands.map((e, i) => formData.append(`brand[${i}]`, e._id));
    selectedSubcategories.map((e, i) =>
      formData.append(`subcategories[${i}]`, e._id)
    );
    console.log(SelectedCategory, "SelectedCategory");
    // formData.append(`images`, file);
    const filesArray = Array.from(file);
    filesArray.forEach((filess, index) => {
      formData.append(`images`, filess);
    });

    try {
      // Send a POST request to your API endpoint
      const response = await axios.post(`${baseurl.url}addProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for sending form data
        },
      });
      console.log(response.data.status, "response response");
      // Handle the response, e.g., show a success message
      if (response.data.status === true) {
        alert(response.data.message);
        // window.location.reload();
        setInputValue({
          name: "",
          price: "",
          discountedPrice: "",
          menuProductNumber: "",
          totalUnits: "",
          shortDescription: "",
          longDescription: "",
          ProductLink: "",
        });
        toast.success("Successfully Added !");

        // fetchDataFromServer()
        // onCloseModal()
      }
      console.log("Upload successful", response);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Upload failed", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value, // Use the input field's name as the key
    });
  };

  const fetchDataFromServer = async () => {
    try {
      // Send a GET request to your API endpoint
      const response = await axios.get(`${baseurl.url}getCategories`);
      // Handle the response data, e.g., set it in state
      setResCategory(response.data.categories);
      console.log(response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("GET request failed", error);
    }
  };
  const fetchDataFromServerBrands = async () => {
    try {
      // Send a GET request to your API endpoint
      const response = await axios.get(`${baseurl.url}getBrand`);

      // Handle the response data, e.g., set it in state
      setResBrands(response.data.brands);
      console.log(response.data, "response.data");
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("GET request failed", error);
    }
  };

  const handleCheckboxChange = (e, type) => {
    const brandId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      // If the checkbox is checked, add the brand to the selectedBrands array
      if (type === "selectedBrand") {
        setSelectedBrands([...selectedBrands, { _id: brandId }]);
      } else if (type === "selectedCategory") {
        setSelectedCategory([...SelectedCategory, { _id: brandId }]);
      }
      if (type === "selectedSubcategory") {
        setSelectedSubcategories([...selectedSubcategories, { _id: brandId }]);
      }
    } else {
      // If the checkbox is unchecked, remove the brand from the selectedBrands array
      if (type === "selectedBrand") {
        setSelectedBrands(
          selectedBrands.filter((brand) => brand._id !== brandId)
        );
      } else if (type === "selectedCategory") {
        setSelectedCategory(
          SelectedCategory.filter((brand) => brand._id !== brandId)
        );
      }
      if (type === "selectedSubcategory") {
        setSelectedSubcategories(
          selectedSubcategories.filter((category) => category._id !== brandId)
        );
      }
    }
  };

  const GetSubcategories = async () => {
    try {
      // Send a GET request to your API endpoint
      const response = await axios.get(`${baseurl.url}getsubCategories`);
      // Handle the response data, e.g., set it in state
      // setResCategory(response.data.categories);
      setSubcategories(response.data.categories);
      console.log(response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("GET request failed", error);
    }
  };
  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchDataFromServer();
    GetSubcategories();
    fetchDataFromServerBrands();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Add Products" parent="Digital" />
      <Container fluid={true}>
        <Row className="product-adding">
          <Col xl="8">
            <Card>
              <CardHeader>
                <h5>General</h5>
              </CardHeader>
              <CardBody>
                <div className="digital-add needs-validation">
                  <FormGroup>
                    <Label className="col-form-label pt-0">
                      <span>*</span> Name
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom01"
                      type="text"
                      required=""
                      onChange={handleInputChange}
                      name="name"
                      value={inputValue.name}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label pt-0">
                      <span>*</span> price
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="number"
                      name="price"
                      required=""
                      onChange={handleInputChange}
                      value={inputValue.price}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label pt-0">
                      <span>*</span> discountedPrice
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="number"
                      name="discountedPrice"
                      required=""
                      onChange={handleInputChange}
                      value={inputValue.discountedPrice}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label pt-0">
                      <span>*</span> menuProductNumber
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="number"
                      name="menuProductNumber"
                      required=""
                      onChange={handleInputChange}
                      value={inputValue.menuProductNumber}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="col-form-label pt-0">
                      <span>*</span> Units Sold
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="number"
                      name="totalUnits"
                      required=""
                      onChange={handleInputChange}
                      value={inputValue.totalUnits}
                    />
                  </FormGroup>
                  <p>Select Categories</p>
                  {cat?.map((e, i) => {
                    return (
                      <>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="isChecked"
                              value={e?._id}
                              // checked={isChecked}
                              // onChange={handleCheckboxChange}

                              onChange={(e) =>
                                handleCheckboxChange(e, "selectedCategory")
                              }
                            />{" "}
                            {e?.name}
                          </Label>
                        </FormGroup>
                      </>
                    );
                  })}
                  <p className="mt-3">Select Subcategories </p>
                  {subcategories?.map((e, i) => {
                    return (
                      <>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="isChecked"
                              value={e?._id}
                              // checked={isChecked}
                              // onChange={handleCheckboxChange}

                              onChange={(e) =>
                                handleCheckboxChange(e, "selectedSubcategory")
                              }
                            />{" "}
                            {e?.name}
                          </Label>
                        </FormGroup>
                      </>
                    );
                  })}
                  {/* <p>Select Categories</p>
                  <div className="category-container">
                    {cat?.map((e, i) => (
                      <div key={e._id}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="isChecked"
                              value={e?._id}
                              onChange={(e) =>
                                handleCheckboxChange(e, "selectedCategory")
                              }
                            />{" "}
                            {e?.name}
                          </Label>
                        </FormGroup>

                        {SelectedCategory.find((cat) => cat._id === e._id) && (
                          <div className="ms-5">
                            <p className="">Select Subcategories</p>
                            {subcategories.map((subcat, i) => (
                              <div key={subcat._id}>
                                <FormGroup check>
                                  <Label check>
                                    <Input
                                      type="checkbox"
                                      name="isChecked"
                                      value={subcat._id}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "selectedSubcategory"
                                        )
                                      }
                                    />{" "}
                                    {subcat.name}
                                  </Label>
                                </FormGroup>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div> */}
                  <p className="mt-3">Select Brands</p>
                  {brands?.map((e, i) => {
                    return (
                      <>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="isChecked"
                              value={e?._id}
                              // checked={isChecked}
                              onChange={(e) =>
                                handleCheckboxChange(e, "selectedBrand")
                              }
                            />{" "}
                            {e?.name}
                          </Label>
                        </FormGroup>
                      </>
                    );
                  })}

                  {/* <FormGroup>
										<Label className="col-form-label">
											<span>*</span> Categories
										</Label>
										<select className="form-select" required=""
										onChange={handleInputChange}>
											<option value="">--Select--</option>
											<option value="1">eBooks</option>
											<option value="2">Graphic Design</option>
											<option value="3">3D Impact</option>
											<option value="4">Application</option>
											<option value="5">Websites</option>
										</select>
									</FormGroup> */}

                  <FormGroup>
                    <Label className="col-form-label">long Description</Label>
                    <textarea
                      rows="4"
                      name="longDescription"
                      onChange={handleInputChange}
                      cols="12"
                    ></textarea>
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">
                      <span>*</span> Short Description
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="text"
                      required=""
                      onChange={handleInputChange}
                      name="shortDescription"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">
                      <span>*</span> Product Link
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="text"
                      required=""
                      name="ProductLink"
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="message-text" className="col-form-label">
                      Product Image :
                    </Label>
                    <Input
                      className="form-control"
                      id="validationCustom02"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                    />
                  </FormGroup>
                  {/* <Label className="col-form-label pt-0"> Product Upload</Label> */}
                  {/* <MyDropzone /> */}
                </div>
                <div className="btn-popup pull-right">
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => handleFormSubmit()}
                    data-toggle="modal"
                    data-original-title="test"
                    data-target="#exampleModal"
                  >
                    Add Product
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* <Col xl="6">
						<Card>
							<CardHeader>
								<h5>Add Description</h5>
							</CardHeader>
							<CardBody>
								<div className="digital-add needs-validation">
									<FormGroup className=" mb-0">
										<div className="description-sm">
										<MDEditor
									value={value}
									onChange={onChange}
								/>
										</div>
									</FormGroup>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<h5>Meta Data</h5>
							</CardHeader>
							<CardBody>
								<div className="digital-add needs-validation">
									<FormGroup>
										<Label className="col-form-label pt-0"> Meta Title</Label>
										<Input
											className="form-control"
											id="validationCustom05"
											type="text"
											required=""
										/>
									</FormGroup>
									<FormGroup>
										<Label className="col-form-label">Meta Description</Label>
										<textarea rows="4" cols="12"></textarea>
									</FormGroup>
									<FormGroup className="mb-0">
										<div className="product-buttons text-center">
											<Button type="button" color="primary">
												Add
											</Button>
											<Button type="button" color="light">
												Discard
											</Button>
										</div>
									</FormGroup>
								</div>
							</CardBody>
						</Card>
					</Col> */}
        </Row>
      </Container>
    </Fragment>
  );
};

export default Digital_add_pro;
