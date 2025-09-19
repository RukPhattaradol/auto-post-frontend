// src/pages/TestAPI.jsx
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function TestAPI() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleTestAPI = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch(url);

      // ตรวจสอบ content-type ของ response
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setResponse({ type: "json", data });
      } else if (contentType && contentType.includes("image")) {
        const blob = await res.blob();
        const imgUrl = URL.createObjectURL(blob);
        setResponse({ type: "image", imgUrl });
      } else {
        // fallback: treat as text
        const text = await res.text();
        setResponse({ type: "text", text });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "2rem" }}>
        <h2>Test API</h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Enter API URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "80%", padding: "0.5rem" }}
          />
          <button
            onClick={handleTestAPI}
            style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}
          >
            Send Request
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {error && (
          <p style={{ color: "red" }}>Error: {error}</p>
        )}

        {response && response.type === "json" && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Response (JSON):</h3>
            <pre
              style={{
                background: "#f4f4f4",
                padding: "1rem",
                borderRadius: "8px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {JSON.stringify(response.data, null, 2)}
            </pre>

            {/* ถ้า JSON มี base64 image */}
            {response.data.filedata && (
              <div style={{ marginTop: "1rem" }}>
                <h4>Image from JSON:</h4>
                <img
                  src={`data:${response.data.filetype};base64,${response.data.filedata}`}
                  alt={response.data.filename || "image"}
                  style={{ maxWidth: "300px", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>
        )}

        {response && response.type === "image" && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Image Response:</h3>
            <img
              src={response.imgUrl}
              alt="API response"
              style={{ maxWidth: "300px", borderRadius: "8px" }}
            />
          </div>
        )}

        {response && response.type === "text" && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Response (Text):</h3>
            <pre
              style={{
                background: "#f4f4f4",
                padding: "1rem",
                borderRadius: "8px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {response.text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
