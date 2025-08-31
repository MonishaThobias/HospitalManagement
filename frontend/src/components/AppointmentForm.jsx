import { useState } from "react";
import API from '../services/api.js'

export default function AppointmentForm({ user,doctors }) {
  
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError("");

    try {
   
      // Combine date + time to ISO format
      const dateTime = new Date(`${date}T${time}`).toISOString();

      const payload = {
        patient_id: Number(user),   // <-- get from logged-in user (not hardcoded)
        doctor_id: Number(doctorId),
        date_time: dateTime,
        status: "pending"
      };
console.log("Payload being sent:", payload);
      const res = await API.post("/appointments/", payload);

      console.log("Booked appointment:", res.data);
      alert("Appointment booked successfully!");
      setDoctorId("");
      setDate("");
      setTime("");
      setError("");
      
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("Error booking appointment. Try again.");
    }
  };

  return (
    <form onSubmit={handleBookAppointment} className="p-4" 
    style={{ maxWidth: '400px', margin: 'auto', padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
     <label>Choose a Doctor:</label>
      <select className="form-select mb-3"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        required
      >
        <option value="">-- Select Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name} ({doc.specialization})
          </option>
        ))}
      </select>

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="form-control mb-3"
      />

      <label>Time:</label>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="form-control mb-3"
      />

      <button type="submit" className="btn">Book</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
