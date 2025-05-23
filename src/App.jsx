
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`\${API_URL}/varieties/\`)
      .then((res) => res.json())
      .then((data) => {
        setVarieties(data.message || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Cannacore Demo Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Registered Varieties:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-6">
          {Array.isArray(varieties)
            ? varieties.map((v, i) => <li key={i}>{v}</li>)
            : <li>Backend demo active</li>}
        </ul>
      )}
    </div>
  );
}

export default App;
