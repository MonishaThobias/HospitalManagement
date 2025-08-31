import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import html2pdf from 'html2pdf.js';
import {FaEdit, FaTrash, FaDownload} from 'react-icons/fa';

const Billing = () => {
  const [billings, setBillings] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    service: '',
    amount: '',
    status: 'Pending'
  });
  const [editingId, setEditingId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const invoiceRef = useRef();
  const [currentBill, setCurrentBill] = useState(null); // For PDF content
const [selectedBill, setSelectedBill] = useState(null);

  const selectedPatient = patients.find(p => p.id === Number(form.patient_id));

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  // Fetch billings
  const fetchBillings = async () => {
    try {
      const res = await API.get('/billing');
      setBillings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBillings();
    fetchPatients();
     if (selectedBill) {
    const element = invoiceRef.current;
    html2pdf().from(element).save(`invoice-${selectedBill.id}.pdf`).then(() => {
      setSelectedBill(null); // reset after download
    });
  }
}, [selectedBill]
 );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient_id) {
      alert("Please select a valid patient.");
      return;
    }
    try {
      if (editingId) {
        await API.put(`/billing/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post('/billing', form);
      }
      setForm({ patient_id: '', service: '', amount: '', status: 'Pending' });
      fetchBillings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (bill) => {
    setForm({
      patient_id: bill.patient_id,
      service: bill.service,
      amount: bill.amount,
      status: bill.status,
    });
    setEditingId(bill.id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/billing/${id}`);
      fetchBillings();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered list based on search
  const filtered = billings.filter(b =>
    b.patient && b.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const downloadInvoice = (bill) => {
  setSelectedBill(bill);
};

  return (
    <div className="billing-container">
      <h2>Billing Management</h2>
<div className="row">
    <div className="col-md-4 col-sm-12 ">
        <div className="bg-white p-3 rounded shadow-sm">
{/* Search */}
      <input
        type="text"
        placeholder="Search by patient name"
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Billing Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Patient Name Autocomplete */}
        <input
          type="text"
          placeholder="Type patient name"
          className="form-control mb-2"
          list="patient-list"
          value={selectedPatient ? selectedPatient.name : ''}
          onChange={(e) => {
            const selected = patients.find(
              (p) => p.name.toLowerCase() === e.target.value.toLowerCase()
            );
            if (selected) {
              setForm({ ...form, patient_id: selected.id });
            } else {
              setForm({ ...form, patient_id: '' });
            }
          }}
        />
        <datalist id="patient-list">
          {patients.map((p) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>

        {/* Form fields */}
        <input
          type="number"
          placeholder="Patient ID"
          value={form.patient_id}
          onChange={e => setForm({ ...form, patient_id: e.target.value })}
          required className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Service"
          value={form.service}
          onChange={e => setForm({ ...form, service: e.target.value })}
          required className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required className="form-control mb-2"
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="form-control mb-2"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update' : 'Create'} Billing
        </button>
      </form>
        </div>

    </div>
    <div className="col-md-8 col-sm-12">
       
        <div className="table-responsive bg-white p-3 rounded shadow-sm">
 {/* Billing Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Patient</th><th>Service</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.patient?.name || 'N/A'}</td>
              <td>{b.service}</td>
              <td>{b.amount}</td>
              <td>{b.status}</td>
              <td>{new Date(b.date).toLocaleString()}</td>
              <td>
                <button className="add-btn btn-sm btn-warning me-1" onClick={() => handleEdit(b)} title='Edit'><FaEdit /></button>
                <button className="add-btn btn-sm btn-danger me-1" onClick={() => handleDelete(b.id)} title='Delete'><FaTrash /></button>
                <button className="add-btn btn-sm btn-success" onClick={() => downloadInvoice(b)} title='Download Invoice'>
                    <FaDownload /></button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" className="text-center">No billing records found.</td></tr>
          )}
        </tbody>
      </table>
</div>
      {/* Hidden Invoice Template */}
      <div ref={invoiceRef}  style={{ padding: '20px', backgroundColor: '#fff' }}>
        
        <h1>Invoice</h1>
{selectedBill && (
  <>
    <p><strong>Invoice ID:</strong> {selectedBill.id}</p>
    <p><strong>Patient:</strong> {selectedBill.patient?.name || 'N/A'}</p>
    <p><strong>Service:</strong> {selectedBill.service}</p>
    <p><strong>Amount:</strong> ₹{selectedBill.amount}</p>
    <p><strong>Status:</strong> {selectedBill.status}</p>
    <p><strong>Date:</strong> {new Date(selectedBill.date).toLocaleString()}</p>
  </>
)}
      </div>
    </div>
</div>
      

     
    </div>
  );
};

export default Billing;
