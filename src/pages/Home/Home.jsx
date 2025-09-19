import { useState } from "react";

function App() {
  // ตัวอย่าง data รูปจาก backend
  const items = [
    { id: 1, caption: "รูปที่ 1", url: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg" },
    { id: 2, caption: "รูปที่ 2", url: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg" },
    { id: 3, caption: "รูปที่ 3", url: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg" },
  ];

  const groupOptions = ["Group 1", "Group 2", "Group 3", "Group 4"];

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // toggle group checkbox
  const handleGroupChange = (group) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  // select one item (radio)
  const handleItemSelect = (id) => {
    setSelectedItem(id);
  };

  const handleSubmit = async () => {
    if (!selectedItem || selectedGroups.length === 0) {
      alert("กรุณาเลือกกลุ่มและรูป");
      return;
    }

    const data = {
      selectedGroups,
      selectedItem,
    };

    try {
      const response = await fetch(
        "https://n8n.cynlive.com/webhook-test/bdd937b8-ffdf-4b68-9484-996fdf7e7cd2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      <h2>เลือกรูปและกลุ่ม</h2>

      <div style={{ marginBottom: 16 }}>
        <label>เลือกกลุ่ม:</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
          {groupOptions.map((g) => (
            <label key={g} style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                checked={selectedGroups.includes(g)}
                onChange={() => handleGroupChange(g)}
              />{" "}
              {g}
            </label>
          ))}
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>เลือก</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>รูป</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Caption</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
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
                <img src={item.url} alt={item.caption} style={{ maxWidth: 100 }} />
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.caption}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
        Submit
      </button>
    </div>
  );
}

export default App;
