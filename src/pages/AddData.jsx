import React, { useState, useEffect } from "react";
import { addDataApi, getAllDataApi } from "../apis/api";
import { toast } from "react-toastify";
import "../styles/sidebar.css";

const AddData = () => {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dataImage, setDataImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [encrypted, setEncrypted] = useState(true); // State to track encryption status
  const [showData, setShowData] = useState(false); // State to track data visibility

  useEffect(() => {
    getAllDataApi()
      .then((res) => {
        console.log("API Response:", res.data); // Log the response
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch data!");
        setLoading(false);
      });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setDataImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Invalid phone number. Please enter a 10-digit number.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    formData.append("dataImage", dataImage);

    addDataApi(formData)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setData((prevData) => [...prevData, res.data.data]);
          // Reset form
          setFullName("");
          setDateOfBirth("");
          setAddress("");
          setPhoneNumber("");
          setEmail("");
          setDataImage(null);
          setPreviewImage(null);
          setEncrypted(true); // Reset encryption to encrypted after new data
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Internal Server Error!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleDecrypt = () => {
    setEncrypted(false); // Show decrypted data
    setShowData(true);   // Ensure data is visible when decrypted
  };

  const handleEncrypt = () => {
    setEncrypted(true); // Show encrypted data
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-success">Add Data</h1>
        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Your Data
        </button>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Create Your New Data
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    className="form-control border-success"
                    type="text"
                    id="fullName"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    value={dateOfBirth}
                    className="form-control border-success"
                    type="date"
                    id="dateOfBirth"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    className="form-control border-success"
                    type="text"
                    id="address"
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                    className="form-control border-success"
                    type="text"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="form-control border-success"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dataImage" className="form-label">
                    Your Image
                  </label>
                  <input
                    onChange={handleImageUpload}
                    type="file"
                    className="form-control border-success"
                    id="dataImage"
                    required
                  />
                </div>
                {previewImage && (
                  <img
                    src={previewImage}
                    className="img-fluid rounded object-cover mt-2"
                    alt="Preview"
                  />
                )}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-success">Loading data...</div>
      ) : (
        <div>
          <div className="d-flex justify-content-end mb-2">
            <button
              className={`btn ${encrypted ? "btn-primary" : "btn-secondary"}`}
              onClick={encrypted ? handleDecrypt : handleEncrypt}
            >
              {encrypted ? "Decrypt" : "Encrypt"}
            </button>
          </div>

          {encrypted && !showData && (
            <div className="text-center text-muted">
              <i className="bi bi-lock" style={{ fontSize: "2rem" }}></i>
              <p>Data is encrypted. Click "Decrypt" to view the data.</p>
            </div>
          )}

          {!encrypted && showData && (
            <table className="table table-hover mt-4">
              <thead className="table-success">
                <tr>
                  <th>Your Image</th>
                  <th>Full Name</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.dataImageUrl}
                          className="img-thumbnail"
                          height={40}
                          width={40}
                          alt="Data"
                        />
                      </td>
                      <td>{item.fullName}</td>
                      <td>{new Date(item.dateOfBirth).toLocaleDateString()}</td>
                      <td>{item.address}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AddData;
