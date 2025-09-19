import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function Groups() {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);   // โหลดข้อมูล
  const [blocking, setBlocking] = useState(false); // ปิดทุก action

  const API_BASE = "https://n8n.cynlive.com/webhook/api/auto-post";

  // โหลดข้อมูลกลุ่ม
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/get-data-groups`);
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // เพิ่มกลุ่มใหม่
  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupId.trim()) {
      alert("กรอก Group Name และ Group ID ให้ครบ");
      return;
    }

    setBlocking(true); // 🔒 ปิดหน้า
    try {
      const body = {
        group_name: groupName.trim(),
        group_username: groupId.trim(),
      };

      const res = await fetch(`${API_BASE}/add-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("เพิ่มกลุ่มไม่สำเร็จ");
      await res.json().catch(() => ({}));

      setGroupName("");
      setGroupId("");

      // ✅ Delay 2 วิ
      await new Promise((r) => setTimeout(r, 2000));
      await fetchGroups();

      alert("เพิ่มกลุ่มสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เพิ่มกลุ่มไม่สำเร็จ");
    } finally {
      setBlocking(false);
    }
  };

  // ลบกลุ่ม
  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบกลุ่มนี้หรือไม่?")) return;

    setBlocking(true); // 🔒 ปิดหน้า
    try {
      const res = await fetch(`${API_BASE}/delete-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      // ✅ Delay 2 วิ
      await new Promise((r) => setTimeout(r, 2000));
      await fetchGroups();
    } catch (err) {
      console.error(err);
      alert("ลบกลุ่มไม่สำเร็จ");
    } finally {
      setBlocking(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif", position: "relative" }}>
      <Navbar />
      <h2>จัดการกลุ่ม</h2>

      {/* ฟอร์มเพิ่มกลุ่ม */}
      <form
        onSubmit={handleAddGroup}
        style={{
          border: "1px solid #ccc",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          opacity: blocking ? 0.5 : 1,
          pointerEvents: blocking ? "none" : "auto",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={blocking}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Group ID:</label>
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={blocking}
          />
        </div>

        <button
          type="submit"
          disabled={blocking}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: blocking ? "not-allowed" : "pointer",
          }}
        >
          Add Group
        </button>
      </form>

      {/* ตารางกลุ่ม */}
      <h3>รายการกลุ่ม</h3>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            opacity: blocking ? 0.5 : 1,
            pointerEvents: blocking ? "none" : "auto",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Group Name</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Group ID</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                  ไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              groups.map((g) => (
                <tr key={g.id}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{g.id}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{g.group_name}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{g.group_username}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <button
                      onClick={() => handleDelete(g.id)}
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: blocking ? "not-allowed" : "pointer",
                      }}
                      disabled={blocking}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 🔄 Loading Overlay */}
      {blocking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              border: "6px solid #ccc",
              borderTop: "6px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
