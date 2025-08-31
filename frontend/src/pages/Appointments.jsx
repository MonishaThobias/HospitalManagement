import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../assets/css/appointments.css';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date_time: '',
    status: 'pending',
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/appointments/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post('/appointments', form);
      }
      setForm({ patient_id: '', doctor_id: '', date_time: '', status: 'pending' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(app =>
    app.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="appointments-page" style={{ width:'100%',display: "flex", justifyContent: "space-between", gap: '15px', alignItems: "start" }}>
      <div className='left-panel'>
        <form
          onSubmit={handleFormSubmit}
          
        >
          <h3 style={{ color: "black", textAlign: 'center' }}>{editingId ? "Edit" : "New"} Appointment</h3>

          <input
            type="number"
            placeholder="Patient ID"
            value={form.patient_id}
            onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
            required
            className='form-control mb-3'
          />
          <input
            type="number"
            placeholder="Doctor ID"
            value={form.doctor_id}
            onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            required
            className='form-control mb-3'
          />
          <input
            type="datetime-local"
            value={form.date_time}
            onChange={(e) => setForm({ ...form, date_time: e.target.value })}
            required
            className='form-control mb-3'
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className='form-control mb-3'
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button type="submit" className='btn'>{editingId ? 'Update' : 'Create'}</button>
        </form>

        {/* 🔎 Search Box */}
        <input
          type="text"
          placeholder="Search by doctor or patient name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to page 1
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "15px"
          }}
        />
      </div>

      <div className="right-panel">
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <>
          <div className="table-responsive">
            <table border="1" cellPadding="8" className='appointments-table  table table-striped table-hovered caption-top'>
              <caption>
                <h3 className="mt-4 text-center text-white">All Appointments</h3>
              </caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map(app => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.patient.name}</td>
                    <td>{app.doctor.name}</td>
                    <td>{new Date(app.date_time).toLocaleString()}</td>
                    <td>{app.status}</td>
                    <td>
                      <button className="add-btn" style={{ width: '25%' }} onClick={() => {
                        setForm({
                          patient_id: app.patient.id,
                          doctor_id: app.doctor.id,
                          date_time: app.date_time.slice(0, 16), // for datetime-local
                          status: app.status
                        });
                        setEditingId(app.id);
                      }}>
                        <FaEdit />
                      </button>&nbsp;
                      <button className='add-btn' style={{ width: '25%' }}
                        onClick={() => alert(
                          `Appointment Details:\n\nID: ${app.id}\nPatient: ${app.patient.name}\nDoctor: ${app.doctor.name}\nDate: ${new Date(app.date_time).toLocaleString()}\nStatus: ${app.status}`)}>
                        <FaEye />
                      </button>&nbsp;
                      <button className='add-btn' style={{ width: '25%' }} onClick={async () => {
                        try {
                          await API.delete(`/appointments/${app.id}`);
                          setAppointments(appointments.filter(a => a.id !== app.id));
                        } catch (err) {
                          console.error(err);
                        }
                      }}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls" style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="add-btn" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span style={{ margin: '0 15px' }}>Page {currentPage} of {totalPages}</span>
                <button className="add-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;
