import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import PlusDropdown from "./PlusOptions";
import "../css/Toolbar.css";
import axios from "axios";

function Toolbar({ onSort, onSearch,onCreateFolder }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleCreateFolder = () => {
    // Trigger folder creation and inform the parent component
    onCreateFolder();
  };

  return (
    <Container fluid>
      <Row className="align-items-center justify-content-center mt-4 search-form">
        <Col xs={12} sm={6} md={6} lg={6} xl={6}>
          <Col style={{ display: "flex" }}>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" onClick={handleSearchSubmit}>
              Search
            </Button>
          </Col>{" "}
        </Col>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className="d-flex justify-content-end"
        >
          <div className="plus-dropdown mr-3">
            <PlusDropdown onCreateFolder={handleCreateFolder} />
          </div>
          <Dropdown className="sort-dropdown mr-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Sort By
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onSort("name")}>Name</Dropdown.Item>
              <Dropdown.Item onClick={() => onSort("date")}>Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
}

export default Toolbar;
