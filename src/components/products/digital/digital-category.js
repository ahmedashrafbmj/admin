import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import data from "../../../assets/data/digital-category";
// import Datatable from "../../common/datatable";
import DataTable from "react-data-table-component";

// import Modal from "react-responsive-modal";
import { Modal, Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import baseurl from "../../../assets/baseurl/baseurl";
import axios from "axios";
import { toast } from "react-toastify";

const Digital_category = () => {
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState(null);
	console.log(file,"file cat")
	const [res, setRes] = useState();

	const [image, setimage] = useState();

console.log(res,"resssssssssssss");
	const columns = [
		{
			name: 'Name',
			selector: 'name',
			sortable: true,
		},
		{
			name: 'Slug',
			selector: 'link',

			sortable: true,
		},
		{
			name: 'images',
			cell: (row) =>
			//   console.log(row,"row")
			(
				<img
					src={`${baseurl.image + row.images[0]}`} // Assuming "image" is an array and you want the first element
					alt={`Image for ${row.name}`}
					width="50"
					height="50"
				/>
			),
		},
	];

	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false);
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputValue({
			...inputValue,
			[name]: value, // Use the input field's name as the key
		});
	};
	const [inputValue, setInputValue] = useState({ name: '', link: "" });


	const handleFileChange = (e) => {
		const file = e.target.files[0]; // Get the selected file
		console.log(file)
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
	const handleFormSubmit = async () => {



		// Create a FormData object and append the file to it
		const formData = new FormData();
		const filesArray = Array.from(file);
		filesArray.map((file,i)=>formData.append('images', file))
		formData.append('name', inputValue.name.toLocaleLowerCase());
		formData.append('link', inputValue.link.toLocaleLowerCase());

		try {
			// Send a POST request to your API endpoint
			const response = await axios.post(`${baseurl.url}addCategory`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // Important for sending form data
				},
			});

			// Handle the response, e.g., show a success message
			if (response.data.status) {
				alert(response.data.message)
				toast.success("Successfully Deleted !");

				fetchDataFromServer()
				onCloseModal()
			}
			console.log('Upload successful', response);
		} catch (error) {
			// Handle errors, e.g., show an error message
			console.error('Upload failed', error);
		}
	};



	const fetchDataFromServer = async () => {
		try {
			// Send a GET request to your API endpoint
			const response = await axios.get(`${baseurl.url}getCategories`);

			// Handle the response data, e.g., set it in state
			setRes(response.data.categories);
			setimage(response.data.categories.map((e, i) => `${baseurl.image + e.image[0]}`));
			console.log(response.data);
		} catch (error) {
			// Handle errors, e.g., show an error message
			console.error('GET request failed', error);
		}
	};
	console.log(image, "image")

	useEffect(() => {
		// Fetch data from the server when the component mounts
		fetchDataFromServer();
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Category" parent="Digital" />
			{/* <!-- Container-fluid starts--> */}
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Digital Category</h5>
							</CardHeader>
							<CardBody>
								<div className="btn-popup pull-right">
									<Button
										type="button"
										color="secondary"
										onClick={onOpenModal}
										data-toggle="modal"
										data-original-title="test"
										data-target="#exampleModal"
									>
										Add Category
									</Button>
									<Modal isOpen={open} toggle={onCloseModal}>
										<ModalHeader toggle={onCloseModal}>
											<h5
												className="modal-title f-w-600"
												id="exampleModalLabel2"
											>
												Add Digital Product
											</h5>
										</ModalHeader>
										<ModalBody>
											<Form>
												<FormGroup>
													<Label
														htmlFor="recipient-name"
														className="col-form-label"
													>
														Name :
													</Label>
													<Input type="text" className="form-control" name="name" onChange={handleInputChange} />
												</FormGroup>
												<FormGroup>
													<Label
														htmlFor="recipient-name"
														className="col-form-label"
													>
														Slug :
													</Label>
													<Input type="text" className="form-control" name="link" onChange={handleInputChange} />
												</FormGroup>
												<FormGroup>
													<Label
														htmlFor="message-text"
														className="col-form-label"
													>
														Category Image :
													</Label>
													<Input
														className="form-control"
														id="validationCustom02"
														type="file"
														multiple
														onChange={handleFileChange}

													/>
												</FormGroup>
											</Form>
										</ModalBody>
										<ModalFooter>
											<Button
												type="button"
												color="primary"
												onClick={() => handleFormSubmit()}
											>
												Save
											</Button>
											<Button
												type="button"
												color="secondary"
												onClick={onCloseModal}
											>
												Close
											</Button>
										</ModalFooter>
									</Modal>
								</div>
								<div className="clearfix"></div>
								<div id="basicScenario" className="product-physical">
									{/* <Datatable
										multiSelectOption={false}
										myData={res}
										pageSize={5}
										pagination={false}
										class="-striped -highlight"
									/> */}
									<DataTable
										data={res}
										columns={columns}
										pagination={false}
										striped={true}
										center={true}
									/>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			{/* <!-- Container-fluid Ends--> */}
		</Fragment>
	);
};

export default Digital_category;
