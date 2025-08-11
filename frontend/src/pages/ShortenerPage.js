import React, { useState } from "react";
import ShortenUrlForm from "../components/ShortenUrlForm";
import ShortenResults from "../components/ShortenResults";
import Log from "../utils/Log";

const API_BASE = "http://localhost:3001";

export default function ShortenerPage() {
  const [results, setResults] = useState([]);
  const [loadingIndexes, setLoadingIndexes] = useState([]);
  const [errors, setErrors] = useState([]);

  // Multiple URLs: submit in parallel
  async function handleShorten(urlRequests) {
    // Clear before
    setResults([]);
    setLoadingIndexes(urlRequests.map((_, idx) => idx));
    setErrors([]);

    const promises = urlRequests.map(async (req, idx) => {
      try {
        const resp = await fetch(`${API_BASE}/shorturls`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req)
        });
        const data = await resp.json();
        if (resp.ok) {
          Log("frontend", "info", "ShortenerPage", `Shortlink created for index ${idx}`);
          return { ...req, result: data.shortlink, expiry: data.expiry, error: null };
        } else {
          Log("frontend", "warn", "ShortenerPage", `Shortlink creation failed: ${data.error || "Unknown"}`);
          return { ...req, result: null, expiry: null, error: data.error || "Unknown error" };
        }
      } catch (err) {
        Log("frontend", "error", "ShortenerPage", `Network error on shortlink: ${err.message}`);
        return { ...req, result: null, expiry: null, error: err.message };
      }
    });
    const res = await Promise.all(promises);
    setResults(res);
    setLoadingIndexes([]);
    setErrors(res.map(r => r.error));
  }

  return (
    <div>
      <ShortenUrlForm onShorten={handleShorten} />
      <ShortenResults results={results} loadingIndexes={loadingIndexes} />
    </div>
  );
}
