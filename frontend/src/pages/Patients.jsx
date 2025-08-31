import { useEffect, useState } from "react";
import API from "../services/api.js";
import "../assets/css/patients.css";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewModal, setViewModal] = useState(false);
const [viewData, setViewData] = useState(null);


  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact_info: "",
    phone: "",
  });

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    age: "",
    gender: "",
    contact_info: "",
    phone: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/patients/", form);
      setPatients((prev) => [...prev, response.data]); // append new patient
      setForm({ name: "", age: "", gender: "", contact_info: "", phone: "" });
      setShowModal(false);
      alert("Patient added successfully");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient");
    }
  };

  const handleEditClick = (patient) => {
    setEditForm(patient);
    setEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/patients/${editForm.id}`, editForm);
      setPatients((prev) =>
        prev.map((p) => (p.id === editForm.id ? response.data : p))
      );
      setEditModal(false);
      alert("Patient updated successfully");
    } catch (error) {
      console.error("Error editing patient:", error);
      alert("Failed to update patient");
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await API.delete(`/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      alert("Patient deleted successfully");
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient");
    }
  };
// 🔎 Filter by phone number
  const filteredPatients = patients.filter((p) =>
    String(p.phone).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
const handleViewPatient = (patient) => {
  setViewData(patient);
  setViewModal(true);
}



  return (
    <div className="patients-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: '15px' }}>
        <h2>Patients</h2>
          {/* 🔎 Phone Search Filter */}
      <div style={{ margin: "15px 0" }}>
        <input
          type="text"
          placeholder="Search by phone number"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>
        <button className="add-btn" onClick={() => setShowModal(true)} style={{ width: "25%" }}>
          Add Patient
        </button>
       
      </div>

    

      {filteredPatients.length === 0 ? (
        <p>No patient records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="patients-table caption-top table table-striped">
            <caption style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: "white" }}>
              <h2>Patients List</h2>
            </caption>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contact_info}</td>
                  <td>{patient.phone}</td>
                  <td>
                     <button
    className="add-btn"
    style={{ width: "25%" }}
    title="View"
    onClick={() => handleViewPatient(patient)}
  >
    <FaEye />
  </button>&nbsp;&nbsp;
                    <button className="add-btn" style={{ width: "25%" }} title="Edit" onClick={() => handleEditClick(patient)}>
                      <FaEdit />
                    </button>&nbsp;&nbsp;
                    <button className="add-btn" style={{ width: "25%" }} title="Delete" onClick={() => handleDeletePatient(patient.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination Controls */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button disabled={currentPage === 1} onClick={handlePrevPage} className="pagination-btn">Previous</button>
            <span style={{ padding: "0 10px", lineHeight: "2.5" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={handleNextPage} className="pagination-btn">Next</button>
          </div>
        </div>
      )}


{/*       {patients.length === 0 ? (
        <p>No patient records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="patients-table caption-top table table-striped">
            <caption style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: "white" }}>
              <h2>Patients List</h2>
            </caption>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contact_info}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <button className="add-btn" style={{ width: "25%" }} title="Edit" onClick={() => handleEditClick(patient)}>
                      <FaEdit />
                    </button>&nbsp;&nbsp;
                    <button className="add-btn" style={{ width: "25%" }} title="Delete" onClick={() => handleDeletePatient(patient.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

 */}      {/* Add Patient Modal */}
      {showModal && (
        <div className="modals-overlay">
          <div className="modals">
            <h3>Add New Patient</h3>
            <form onSubmit={handleAddPatient}>
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
              <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleInputChange} required />
              <select name="gender" value={form.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input type="text" name="contact_info" placeholder="Contact" value={form.contact_info} onChange={handleInputChange} required />
              <input type="number" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInputChange} required />
              <div className="modals-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editModal && (
        <div className="modals-overlay">
          <div className="modals">
            <h3>Edit Patient</h3>
            <form onSubmit={handleEditPatient}>
              <input type="text" name="name" placeholder="Name" value={editForm.name} onChange={handleEditInputChange} required />
              <input type="number" name="age" placeholder="Age" value={editForm.age} onChange={handleEditInputChange} required />
              <select name="gender" value={editForm.gender} onChange={handleEditInputChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input type="text" name="contact_info" placeholder="Contact" value={editForm.contact_info} onChange={handleEditInputChange} required />
              <input type="number" name="phone" placeholder="Phone Number" value={editForm.phone} onChange={handleEditInputChange} required />
              <div className="modals-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewModal && viewData && (
  <div className="modals-overlay">
    <div className="modals">
      <h3 className="text-center">Patient Profile</h3>
      <div className="patient-profile">
        <p><strong>ID:</strong> {viewData.id}</p>
        <p><strong>Name:</strong> {viewData.name}</p>
        <p><strong>Age:</strong> {viewData.age}</p>
        <p><strong>Gender:</strong> {viewData.gender}</p>
        <p><strong>Contact Info:</strong> {viewData.contact_info}</p>
        <p><strong>Phone:</strong> {viewData.phone}</p>
      </div>
      <div className="modals-actions justify-content-center">
        <button onClick={() => setViewModal(false)} className="btn close-btn">Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
