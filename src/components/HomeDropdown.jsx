import React, { useState } from "react";
import Dropdown from "./dropdown";
import Share from "./Share";
import FileDetailsModal from "./details"
import Move_file from "./move_file";

const HomeDropdown = ({ selectedItem }) => {
  const [showMoveFile, setShowMoveFile] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the visibility of FileDetailsModal

  const folders = [{ name: "one" }, { name: "two" }];
  const homeOptions = [
    { value: "download", label: "Download" },
    { value: "move", label: "Move" },
    { value: "share", label: "Share" },
    { value: "rename", label: "Rename" },
    { value: "delete", label: "Delete" },
    { value: "versions", label: "Versions" },
    { value: "details", label: "Details" },
  ];

  const handleOptionSelect = (selectedOption) => {
    if (selectedOption.value === "details") {
      setShowModal(true); // Show the modal when "Details" option is selected
    } else if (selectedOption.value === "share") {
      // Handle share option
      console.log("Sharing...", selectedItem);
    }
    else if (selectedOption.value === "move") {
      setShowMoveFile(true);
    }
   
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowMoveFile(false);
  };


  return (
    <div>
    <Dropdown
      options={homeOptions}
      onSelect={handleOptionSelect}
      plusIcon={false}
   />
         {showModal && (
        <FileDetailsModal showModal={showModal} onClose={handleCloseModal} fileDetails={selectedItem} />
      )}
     {showMoveFile ? <Move_file folders={folders} onClose={handleCloseModal}/> : null}
  </div>
  );
};

export default HomeDropdown;