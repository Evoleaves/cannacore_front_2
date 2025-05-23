
import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [view, setView] = useState("dashboard");
  const [varieties, setVarieties] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  fetch(`${API_URL}/varieties/`)
    .then((res) => res.json())
    .then((data) => {
      setVarieties(data.message || []);
    })
    .catch(() => setVarieties(["Error loading varieties"]));
}, [view]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch(\`\${API_URL}/predict/\`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Prediction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <header className="bg-green-700 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Cannacore Dashboard</h1>
        <nav>
          <button onClick={() => setView("dashboard")} className="mx-2">Dashboard</button>
          <button onClick={() => setView("predict")} className="mx-2">Analyze Image</button>
        </nav>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        {view === "dashboard" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Registered Varieties</h2>
            <ul className="list-disc pl-6">
              {Array.isArray(varieties)
                ? varieties.map((v, i) => <li key={i}>{v}</li>)
                : <li>No data</li>}
            </ul>
          </>
        )}

        {view === "predict" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Upload an Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
            {preview && <img src={preview} alt="preview" className="w-full max-w-xs mb-4" />}
            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Image"}
            </button>
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
