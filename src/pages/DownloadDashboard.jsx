import React, { useRef } from "react";
import useMarkerManager from "../hooks/useMarkerManager";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dashboard from "./Dashboard";

const DownloadDashboard = () => {
  const dashboardRef = useRef(null);

  const handleDownload = async () => {
    try {
      const canvas = await html2canvas(dashboardRef.current);
      const imageData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
  
      pdf.save("dashboard.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
    }
  };

  return (
    <>
      <div className="share--details-container">
        <div className="span-items">
          <div className="heading share--cebu-route">CebuRoute</div>
          <button data-html2canvas-ignore="true" className="share--details-download-btn" onClick={handleDownload}>
            <FontAwesomeIcon className="btn-icons" icon={faFileArrowDown} /> PDF FILE
          </button>
        </div>
        <div className="share--dashboard-header no-animation" ref={dashboardRef}>
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default DownloadDashboard;
