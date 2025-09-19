// src/pages/App.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 2; // แสดง 2 row ต่อ page

  // ดึง log จาก API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://n8n.cynlive.com/webhook/api/auto-post/get-log"
        );
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
        alert("โหลด log ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // สถิติ
  const successCount = logs.filter((log) => log.status === "success").length;
  const failedCount = logs.filter((log) => log.status === "failed").length;
  const runningCount = logs.filter((log) => log.status === "running").length;

  // Pagination
  const totalPages = Math.ceil(logs.length / rowsPerPage);
  const currentLogs = logs.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <Navbar />
      <h1>Dashboard</h1>

      {/* overlay loading */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="loader" />
          <style>{`
            .loader {
              border: 8px solid #f3f3f3;
              border-top: 8px solid #007bff;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* สถิติ */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Success</h3>
          <p style={{ fontSize: "1.5rem", color: "green" }}>{successCount}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Failed</h3>
          <p style={{ fontSize: "1.5rem", color: "red" }}>{failedCount}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Running</h3>
          <p style={{ fontSize: "1.5rem", color: "orange" }}>{runningCount}</p>
        </div>
      </div>

      {/* ตาราง log */}
      <div
        style={{
          width: "60%", // 3/5 ของหน้าจอ
          margin: "0 auto",
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>วันที่</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>รูป</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Caption</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Group Name</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                  ไม่มี log
                </td>
              </tr>
            ) : (
              currentLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {new Date(log.created_at).toLocaleString("th-TH")}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {log.data ? (
                      <img
                        src={`data:image/jpeg;base64,${log.data}`}
                        alt="post"
                        style={{ maxWidth: 80, cursor: "pointer" }}
                        onClick={() => setModalImage(`data:image/jpeg;base64,${log.data}`)}
                      />
                    ) : (
                      "ไม่มีรูป"
                    )}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{log.post_caption}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{log.group_name}</td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      color:
                        log.status === "success"
                          ? "green"
                          : log.status === "failed"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {log.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "1rem" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          ก่อนหน้า
        </button>
        <span>Page {currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage + 1 >= totalPages}
        >
          ถัดไป
        </button>
      </div>

      {/* modal แสดงรูปใหญ่ */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <img src={modalImage} alt="large" style={{ maxHeight: "80%", maxWidth: "80%" }} />
        </div>
      )}
    </div>
  );
}
