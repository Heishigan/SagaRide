// src/components/QRScanner.js
import React, { useState } from "react";
import QrReader from "react-qr-reader";

const QRScanner = ({ onScan }) => {
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      onScan(data); // Pass scanned data to parent component
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div>
      <QrReader
        delay={300} // Scan delay in milliseconds
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default QRScanner;