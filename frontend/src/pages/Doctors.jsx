import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../assets/css/doctor.css';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    specialization: '',
    email: '',
    contact_info: '',
    address: '',
    qualification: '',
    experience_years: '',
    gender: '',
    date_of_birth: '',
    availability: '',
    is_active: true
  });

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/doctors/${editId}`, form);
      } else {
        await API.post('/doctors', form);
      }
      setForm({
        id: '',
        name: '',
        specialization: '',
        email: '',
        contact_info: '',
        address: '',
        qualification: '',
        experience_years: '',
        gender: '',
        date_of_birth: '',
        availability: '',
        is_active: true
      });
      setEditId(null);
      fetchDoctors();
    } catch (err) {
      console.error('Failed to save doctor:', err);
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      id: doctor.id || '',
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      email: doctor.email || '',
      contact_info: doctor.contact_info || '',
      address: doctor.address || '',
      qualification: doctor.qualification || '',
      experience_years: doctor.experience_years || '',
      gender: doctor.gender || '',
      date_of_birth: doctor.date_of_birth || '',
      availability: doctor.availability || '',
      is_active: doctor.is_active !== undefined ? doctor.is_active : true
    });
    setEditId(doctor.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error('Failed to delete doctor:', err);
      }
    }
  };

  const handleViewDoctor = (doctor) => {
    setViewData(doctor);
    setViewModal(true);
  };

  const filteredDoctors = doctors.filter((doc) =>
    String(doc.contact_info || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="doctors-page" style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: '15px' }}>
      <div className='left-panel'>
        <form onSubmit={handleSubmit}
         >
          <h2 style={{ color: "black", textAlign: 'center' }}>{editId ? 'Edit Doctor' : 'Add Doctor'}</h2>

          {[
            { name: 'name', type: 'text', placeholder: 'Doctor Name' },
            { name: 'specialization', type: 'text', placeholder: 'Specialization' },
            { name: 'email', type: 'email', placeholder: 'Email' },
            { name: 'contact_info', type: 'number', placeholder: 'Doctor Contact Number' },
            { name: 'qualification', type: 'text', placeholder: 'Doctor Qualification' },
            { name: 'experience_years', type: 'number', placeholder: 'Doctor Experience in years' },
            { name: 'date_of_birth', type: 'date', placeholder: 'Date of Birth' },
            { name: 'availability', type: 'text', placeholder: 'Doctor Availability' }
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              required
              className='form-control mb-3'
            />
          ))}

          <textarea name="address" placeholder='Address' value={form.address} onChange={handleChange}
            required className='form-control mb-3'></textarea>

          <select name="gender" value={form.gender} onChange={handleChange} required className='form-control mb-3'>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </select>

          <button type="submit" className='btn' style={{ width: '180px' }}>{editId ? 'Update' : 'Add'} Doctor</button>&nbsp;&nbsp;
          {editId && (
            <button type="button" className='btn' onClick={() => {
              setForm({
                name: '',
                specialization: '',
                email: '',
                contact_info: '',
                address: '',
                qualification: '',
                experience_years: '',
                gender: '',
                date_of_birth: '',
                availability: '',
                is_active: true
              });
              setEditId(null);
            }} style={{ width: '50px' }} title='Cancel'>
              <FaTrash />
            </button>
          )}
        </form>

        <div style={{ margin: "15px 0" }}>
          <input
            type="text"
            placeholder="Search by phone number"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
      </div>

      <div className="right-panel">
        {filteredDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="table-responsive">
          <table border="1" cellPadding="8" className='doctors-table table table-striped table-hovered caption-top'>
            <caption>
              <h2  className="mt-4 text-center text-white">All Doctors</h2>
            </caption>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Experience</th>
                <th>Gender</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{doc.id}</td>
                  <td>{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.email}</td>
                  <td>{doc.contact_info}</td>
                  <td>{doc.address}</td>
                  <td>{doc.experience_years}</td>
                  <td>{doc.gender}</td>
                  <td>{doc.availability}</td>
                  <td>
                    <button className="add-btn" title="View" onClick={() => handleViewDoctor(doc)}><FaEye /></button>&nbsp;
                    <button className="add-btn" title="Edit" onClick={() => handleEdit(doc)}><FaEdit /></button>&nbsp;
                    <button className="add-btn" title="Delete" onClick={() => handleDelete(doc.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="add-btn" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            <span style={{ margin: '0 15px' }}>Page {currentPage} of {totalPages}</span>
            <button className="add-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>

      {viewModal && viewData && (
        <div className="modals-overlay">
          <div className="modals">
            <h3 className="text-center">Doctor Profile</h3>
            <div className="patient-profile">
              {Object.entries(viewData).map(([key, value]) => (
                <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value?.toString()}</p>
              ))}
            </div>
            <div className="modals-actions justify-center">
              <button onClick={() => setViewModal(false)} className="btn close-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
