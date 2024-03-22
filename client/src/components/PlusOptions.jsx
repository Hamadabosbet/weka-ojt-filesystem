
import Dropdown from './dropdown';
import CreateFolder from './CreateFolder';
import UploadFile from './UploadFile';
import React, { useState } from 'react';

const PlusDropdown = ({onCreateFolder }) => {

  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  
const plusOptions = [
    { value: 'upload', label: 'Upload file' },
    { value: 'newfolder', label: 'New folder' },
  ];


const handleOptionSelect = (selectedOption) => {
  if (selectedOption.value === "upload") {
    setShowUpload(true); // Show the modal when "Details" option is selected
  } else if (selectedOption.value === "newfolder") {
    setShowNewFolder(true);
    onCreateFolder();
    
  }

};
const handleCloseModal = () => {
  setShowUpload(false);
  setShowNewFolder(false);
};


return ( <
  div>
<Dropdown options={plusOptions}
 onSelect={handleOptionSelect}
  plusIcon={true} />
 {showUpload&& <UploadFile closeModal={handleCloseModal}/>}
 {showNewFolder && <CreateFolder onClose={handleCloseModal} />}

</div>
);
};

export default PlusDropdown;


