import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  progress: number; // Prozentwert (0 - 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${clampProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
