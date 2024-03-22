import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addFolder } from "../Dal/data.js";

const CreateFolder = ({ onClose }) => {
  const [newFolderName, setNewFolderName] = useState("");

  const handleChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCreate = async () => {
    try {
      // Call the addFolder API
      const response = await addFolder(1, newFolderName); // Assuming the user ID is 1
      if (response) {
        onClose(); // Close the modal after successful folder creation
        console.log("Folder created successfully");
        // Pass the newly created folder data back to the parent component
      } else {
        console.error("Failed to create folder");
        // Optionally, you can display an error message to the user
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create a Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="folderName">
            <Form.Label>Folder Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateFolder;
