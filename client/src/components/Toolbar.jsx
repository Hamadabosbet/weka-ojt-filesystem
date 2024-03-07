// Toolbar.js
import React, { useState } from "react"; // Import useState
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

function Toolbar() {
  const [searchTerm, setSearchTerm] = useState([]); // State to store the search term

  const handleSearch = () => {
    axios
      .get(`http://localhost:8000/search?user_id=1&search_string=${searchTerm}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
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
            <Button variant="outline-success" onClick={handleSearch}>
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
            <PlusDropdown />
          </div>
          <Dropdown className="sort-dropdown mr-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Sort By
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Name</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
}

export default Toolbar;
