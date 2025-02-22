// src/components/QRScanner.js
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-scanner", // Container ID
      {
        fps: 10, // Frames per second
        qrbox: 250, // Scanning area size
      },
      false // Verbose mode
    );

    html5QrcodeScanner.render(
      (data) => {
        onScan(data); // Pass scanned data to parent component
        onClose(); // Close the scanner after successful scan
      },
      (error) => {
        console.error("QR scanner error:", error);
      }
    );

    scannerRef.current = html5QrcodeScanner;

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear QR scanner:", error);
        });
      }
    };
  }, [onScan, onClose]);

  return (
    <div>
      <div id="qr-scanner"></div>
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Close Scanner
      </button>
    </div>
  );
};

export default QRScanner;