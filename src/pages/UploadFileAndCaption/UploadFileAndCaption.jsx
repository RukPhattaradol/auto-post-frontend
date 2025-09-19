import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";

function App() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null); // ไฟล์เดียว
  const [preview, setPreview] = useState(null); // สำหรับแสดงรูป
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const postUrl = "https://n8n.cynlive.com/webhook/api/auto-post/upload";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("มีไฟล์ที่ไม่ใช่ .png หรือ .jpg");
      setFile(null);
      setPreview(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !file) {
      console.log("กรอกข้อมูลให้ครบ");
      return;
    }

    console.log("กำลังส่ง...", { caption, file });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("file", file);

      const res = await fetch(postUrl, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const result = await res.json().catch(() => ({}));
      console.log("สำเร็จ ✅", result);
      alert("โพสต์สำเร็จ!");
    } catch (err) {
      console.error("ส่งข้อมูลล้มเหลว ❌", err);
      alert("ส่งข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "sans-serif" }}>
      <Navbar />
      <h2>Upload Form</h2>
      <form onSubmit={handleSubmit}>
        {/* ช่อง caption แก้เป็น textarea */}
        <div style={{ marginBottom: 16 }}>
          <label>Caption:</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={15}
            placeholder="พิมพ์ข้อความหลายบรรทัดได้"
            style={{
              width: "100%",
              padding: 8,
              resize: "vertical", // ผู้ใช้ปรับความสูงได้
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>รูปภาพ (.png / .jpg):</label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {preview && (
            <div style={{ marginTop: 10 }}>
              <img src={preview} alt="Preview" style={{ maxWidth: "100%" }} />
            </div>
          )}
        </div>

        <button type="submit" style={{ padding: "8px 16px" }} disabled={loading}>
          {loading ? "กำลังส่ง..." : "Submit & POST"}
        </button>
      </form>
    </div>
  );
}

export default App;
