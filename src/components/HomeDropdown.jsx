import React from "react";
import Dropdown from "./dropdown";
import Share from "./Share";
import FileDetailsModal from "./details"

const HomeDropdown = ({ selectedItem }) => {
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
      return <FileDetailsModal showModal={true} onClose={() => {}} fileDetails={selectedItem} />;
      // Handle details option
    } else if (selectedOption === "share") {
      // Handle share option
      console.log("Sharing...", selectedItem);
    }
  };

  return (
    <Dropdown
      options={homeOptions}
      onSelect={handleOptionSelect}
      plusIcon={false}
   />
  );
};

export default HomeDropdown;
