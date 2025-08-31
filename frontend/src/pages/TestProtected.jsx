import { useEffect, useState } from "react";
import API from "../services/api";

export default function TestProtected() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const res = await API.get("/patients"); // or your protected endpoint
        setData(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching protected data:", err);
        setError("Error: Could not validate credentials");
        setData(null);
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Protected API Test</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <pre
          style={{
            textAlign: "left",
            background: "#eee",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      {!data && !error && <p>Loading...</p>}
    </div>
  );
}
