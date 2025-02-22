// src/components/AchievementModal.js
import React from "react";
import Modal from "react-modal";

const AchievementModal = ({ isOpen, onClose, location }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Achievement Unlocked"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        },
      }}
    >
      <h2>Achievement Unlocked!</h2>
      <p>You have unlocked: {location}</p>
      <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
        Close
      </button>
    </Modal>
  );
};

export default AchievementModal;