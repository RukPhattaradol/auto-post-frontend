// src/pages/App.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

function App() {
  const [groupOptions, setGroupOptions] = useState([]); // [{id, group_name}]
  const [selectedGroups, setSelectedGroups] = useState([]); // จะเก็บ id
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]); // post ที่ดึงมาจาก API

  // ดึงกลุ่มจาก API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          "https://n8n.cynlive.com/webhook/api/auto-post/get-data-groups"
        );
        if (!res.ok) throw new Error("Failed to fetch groups");
        const data = await res.json(); 
        setGroupOptions(data); // เก็บทั้ง id + group_name
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    fetchGroups();
  }, []);

  // ดึง post จาก API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://n8n.cynlive.com/webhook/api/auto-post/get-data-post"
        );
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleGroupChange = (id) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleItemSelect = (id) => {
    setSelectedItem(id);
  };

  const handleSubmit = async () => {
    if (!selectedItem || selectedGroups.length === 0) {
      alert("กรุณาเลือกกลุ่มและรูป");
      return;
    }

    const data = {
      selectedGroups, // จะส่ง id ของกลุ่ม
      selectedItem,
    };

    try {
      const response = await fetch(
        "https://n8n.cynlive.com/webhook/api/auto-post/insert-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการส่งข้อมูล");
      alert("ส่งข้อมูลสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("ส่งข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <Navbar />
      <h2>เลือกรูปและกลุ่ม</h2>

      {/* เลือกกลุ่ม */}
      <div style={{ marginBottom: 16 }}>
        <label>เลือกกลุ่ม:</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
          {groupOptions.map((g) => (
            <label key={g.id} style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                checked={selectedGroups.includes(g.id)}
                onChange={() => handleGroupChange(g.id)}
              />{" "}
              {g.group_name}
            </label>
          ))}
        </div>
      </div>

      {/* ตารางรูป + caption */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>เลือก</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>รูป</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Caption</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const imageUrl = `data:image/jpeg;base64,${item.data}`;
            return (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
                  <input
                    type="radio"
                    name="selectedItem"
                    checked={selectedItem === item.id}
                    onChange={() => handleItemSelect(item.id)}
                  />
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <img src={imageUrl} alt={item.caption} style={{ maxWidth: 100 }} />
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.caption}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
        Submit
      </button>
    </div>
  );
}

export default App;
