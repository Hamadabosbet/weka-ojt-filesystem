import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Paginations from "../components/Paginations";
import Toolbar from "../components/Toolbar";
import Path from "../components/Path";
import { Container, Row, Col } from "react-bootstrap";
import Item from "../components/Item";
import FileViewer from "../components/FileViewer";
import VersionsList from "../components/VersionsList.jsx";
import CreateFolder from "../components/CreateFolder"; // Import CreateFolder component
import { getMyFiles, getMyDeletedFiles, getMySharedFiles } from "../Dal/data.js";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const [currentCategoryData, setcurrentCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data function
  const fetchData = async () => {
    const myFilesData = await getMyFiles();
    const deletedFilesData = await getMyDeletedFiles();
    const sharedFilesData = await getMySharedFiles();

    setMyFiles(myFilesData);
    setDeletedFiles(deletedFilesData);
    setSharedFiles(sharedFilesData);

    // Combine data based on selected category
    if (selectedCategory === "Home") {
      setcurrentCategoryData([...myFilesData, ...sharedFilesData]);
    } else if (selectedCategory === "MyFiles") {
      setcurrentCategoryData(myFilesData);
    } else if (selectedCategory === "DeletedFiles") {
      setcurrentCategoryData(deletedFilesData);
    } else if (selectedCategory === "SharedFiles") {
      setcurrentCategoryData(sharedFilesData);
    }
  };

  // Fetch username function
  const fetchUsername = async () => {
    const response = await get_name();
    setUsername(response);
  };

  // useEffect to fetch data and username when component mounts
  useEffect(() => {
    fetchData();
    fetchUsername();
  }, []);

  // useEffect to update currentCategoryData when selectedCategory changes
  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  // Function to refresh folder list
  const refreshFolders = () => {
    fetchData();
  };
  const handleCreateFolder = () => {
  fetchData();
};

  // Handle search function
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Handle sort function
  const handleSort = (criteria) => {
    setSortBy(criteria);
    // Sort data based on criteria
    const sortedData = [...currentCategoryData].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "date") {
        return new Date(b.upload_date) - new Date(a.upload_date);
      }
    });
    setcurrentCategoryData(sortedData);
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Show version function
  const showVersion = (item) => {
    setSelectedItem(item);
    setShowVersions(true);
    setShowItems(false);
  };

  // Handle category select function
  const handleCategorySelect = (category) => {
    setShowVersions(false);
    setSelectedCategory(category);
    setSelectedItem(null);
    setShowItems(true);
    setCurrentPage(1);
  };

  // Handle item click function
  const handleItemClick = (item) => {
    setShowVersions(false);
    setSelectedItem(item);
  };

  // Handle page change function
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentCategoryData
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Container className={isOpen ? "sidebar-open" : "sidebar-close"}>
        <Header />
      </Container>
      <Container
        style={{ marginTop: "2px", marginBottom: "2px" }}
        className={isOpen ? "sidebar-open" : "sidebar-close"}
      >
        <Toolbar onSort={handleSort} onSearch={handleSearch} onCreateFolder={handleCreateFolder}/>
      </Container>

      <Container
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className={isOpen ? "sidebar-open" : "sidebar-close"}
      >
        <Path />
      </Container>

      <SideBar
        onSelect={handleCategorySelect}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />
      <Container
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className={isOpen ? "sidebar-open" : "sidebar-close"}
      >
        <Row className="justify-content-center">
          <Col xs={12} md={9} id="page-content-wrapper">
            {showItems ? (
              selectedItem ? (
                <FileViewer
                  fileId={selectedItem.id}
                  filePath={selectedItem.path}
                  fileName={selectedItem.name}
                />
              ) : currentItems.length > 0 ? (
                <div className="item-container">
                  {currentItems.map((item) => (
                    <Item
                      key={item.id}
                      id={item.id}
                      item={item}
                      showVersion={() => showVersion(item)}
                      onSelect={() => handleItemClick(item)}
                    />
                  ))}
                </div>
              ) : (
                <p>No items found.</p>
              )
            ) : showVersions ? (
              <VersionsList item={selectedItem} />
            ) : (
              <p>No versions found.</p>
            )}
            <Paginations
              itemsPerPage={itemsPerPage}
              totalItems={currentCategoryData.length}
              paginate={handlePageChange}
            />
          </Col>
        </Row>
      </Container>
      <Container className={isOpen ? "sidebar-open" : "sidebar-close"}>
        <Footer />
      </Container>

    </div>
  );
};

export default HomePage;
