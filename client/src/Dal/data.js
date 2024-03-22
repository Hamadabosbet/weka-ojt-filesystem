import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import axios from "axios";
import {
  Validate_email_format,
  Validate_match_password,
} from "../Validation/Validation.js";
// Dictionary to store user data with example data
// const users = {
//   1: {
//     user_id: 1,
//     username: "user1",
//     email: "user1@example.com",
//     passwordhash:
//       "$2a$10$VlR1BYH1H54kKDlmL/ts/.BkCnf4eEioVVnhRUUQWA6nRQNngRwPW",
//     reset_token: null,
//   },
//   2: {
//     user_id: 2,
//     username: "user2",
//     email: "user2@example.com",
//     passwordhash: "654321",
//     reset_token: null,
//   },
// };

// // Dictionary to store file data with example data
// const files = {
//   1: {
//     file_id: 1,
//     file_name: "file1.txt",
//     user_id: 1,
//     folder_id: 1,
//     size: 1024,
//     is_deleted: false,
//     is_version: false,
//     file_path: "/path/to/file1.txt",
//     upload_date: new Date("2023-01-15"),
//   },
//   2: {
//     file_id: 2,
//     file_name: "file2.pdf",
//     user_id: 1,
//     folder_id: 2,
//     size: 2048,
//     is_deleted: false,
//     is_version: false,
//     file_path: "/path/to/file2.pdf",
//     upload_date: new Date("2023-02-28"),
//   },
//   3: {
//     file_id: 3,
//     file_name: "file3.jpg",
//     user_id: 2,
//     folder_id: null,
//     size: 4096,
//     is_deleted: false,
//     is_version: false,
//     file_path: "/path/to/file3.jpg",
//     upload_date: new Date("2023-03-10"),
//   },
// };

// // Dictionary to store folder data with example data
// const folders = {
//   1: {
//     folder_name: "Folder 1",
//     user_id: 1,
//     parent_folder: null,
//     is_deleted: false,
//     folder_path: "/path/to/Folder1",
//     upload_date: new Date("2023-01-2"),
//   },
//   2: {
//     folder_name: "Folder 2",
//     user_id: 1,
//     parent_folder: null,
//     is_deleted: false,
//     folder_path: "/path/to/Folder2",
//     upload_date: new Date("2023-01-1"),
//   },
// };

// // Dictionary to store file version data with example data
// const fileVersions = {
//   1: { file_id: 1, version_number: 1, upload_date: new Date("2023-04-10") },
//   2: { file_id: 2, version_number: 1, upload_date: new Date("2023-05-10") },
//   3: { file_id: 1, version_number: 2, upload_date: new Date("2023-06-10") },
// };

// // Dictionary to store shared file data with example data
// const sharedFiles = {
//   1: {
//     file_id: 1,
//     shared_with_user_id: 2,
//     shared_by_user_id: 1,
//     permission: "read",
//   },
// };

// // Dictionary to store shared folder data with example data
// const sharedFolders = {
//   1: {
//     folder_id: 1,
//     shared_with_user_id: 2,
//     shared_by_user_id: 1,
//     permission: "read",
//   },
// };

async function registerUser(name, email, password) {
  try {
    const response = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json(); // Parsing response JSON

    if (response.ok) {
      return "User registered successfully.";
    } else {
      throw new Error(data.detail); // Throw error with detail message
    }
  } catch (err) {
    console.error("Error registering user:", err);
    throw err; // Re-throwing the error so it can be caught by the caller
  }
}

async function Forget_password(email) {
  // chick the foemate of the email
  if (!Validate_email_format(email)) return "Invalid email format";

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/forgetpassword?user_email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.msg);

      return data.msg; // Assuming the response contains the success message or error details
    } else {
      throw new Error("Failed to change password. Please try again."); // Throw an error if the request was not successful
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Function to add a file to a user's account
// function addFile(userId, path, file) {
//   const fileId = Object.keys(files).length + 1;
//   files[fileId] = { ...file, user_id: userId, file_path: path };
//   return true;
// }

async function addFolder(folder_id, folder_name) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/folder/${folder_id}/create?folder_name=${folder_name}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return true; // Folder created successfully
    } else {
      return false; // Folder creation failed
    }
  } catch (error) {
    console.error("Error:", error);
    return false; // Request failed
  }
}

async function getMyFolders(folderId) {
  try {
    const folders = await axios.get(`http://127.0.0.1:8000/move`);

    const userFolders = Object.values(folders).filter(
      (folder) => !folder.is_deleted && folder.id !== folderId
    );
    return userFolders;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function moveFile(fileId, targetFolderId) {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/move/${fileId}/${targetFolderId}`
    );

    console.log(`File with ID ${fileId} moved successfully.`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// // Function to handle file download
async function download(fileId) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/file/download/${fileId}`
    );

    console.log(`File with ID ${fileId} downloaded successfully.`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function renameFile(fileId, newName) {
  try {
    console.log(newName);
    const response = await fetch(
      `http://127.0.0.1:8000/${fileId}/rename?new_file_name=${newName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
}

async function getMySharedFiles() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("http://127.0.0.1:8000/shared_files", {
      method: "GET",
      headers: headers,
      credentials: "include", // Include cookies in the request
    });
    if (response.ok) {
      const data = await response.json(); // Parsing response JSON
      return data;
    } else {
      // Handle non-OK response status codes
      if (response.status === 400) {
        // Handle 400 Bad Request error
        throw new Error("User ID cookie is missing");
      } else if (response.status === 500) {
        // Handle 500 Internal Server Error
        throw new Error("Internal Server Error");
      } else {
        // Handle other error cases
        throw new Error("Unexpected Error");
      }
    }
  } catch (err) {
    console.error("Error collecting data:", err);
    throw err;
  }
}

// Function to get files deleted by the user asynchronously
async function getMyDeletedFiles() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("http://127.0.0.1:8000/deleted_files", {
      method: "GET",
      headers: headers,
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      const data = await response.json(); // Parsing response JSON
      return data;
    } else {
      // Handle non-OK response status codes
      if (response.status === 400) {
        // Handle 400 Bad Request error
        throw new Error("User ID cookie is missing");
      } else if (response.status === 500) {
        // Handle 500 Internal Server Error
        throw new Error("Internal Server Error");
      } else {
        // Handle other error cases
        throw new Error("Unexpected Error");
      }
    }
  } catch (err) {
    console.error("Error collecting data:", err);
    throw err;
  }
}

async function delete_file(file_id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/file/${file_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    });

    console.log("File deleted successfully:", response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function delete_folder(folder_id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/folder/${folder_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    });

    console.log("Folder deleted successfully:", response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fileDeletion(file_id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/deleted/files/${file_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      }
    );

    console.log("File permanently deleted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

async function folderDeletion(folder_id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/deleted/folders/${folder_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      }
    );
    console.log("Folder permanently deleted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}

// Function to restore a deleted file
async function restoreDeletedFile(file_id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/deleted/files/restore/${file_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      }
    );

    console.log("File restored successfully:", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// Function to restore a deleted folder
async function restoreDeletedFolder(folder_id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/deleted/files/restore/${folder_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      }
    );

    console.log("Folder restored successfully:", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function LogIn(email, password) {
  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json(); // Parsing response JSON

    if (response.ok) {
      return "User logged in successfully.";
    } else {
      throw new Error(data.detail); // Throw error with detail message
    }
  } catch (err) {
    console.error("Error logging user:", err);
    throw err; // Re-throwing the error so it can be caught by the caller
  }
}

async function getFileVersions(fileId) {
  console.log(fileId);
  try {
    const response = await fetch(`http://127.0.0.1:8000/versions/${fileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching file versions:", error);
    return [];
  }
}

async function getFileDetails(userId, fileId) {
  try {
    // Check if the user has access to the file
    if (files[fileId]) {
      const file = files[fileId]; // Retrieve file data
      const fileDetails = {
        owner: null,
        sharedWith: [],
        permissions: [],
      };

      // Check if the file belongs to the user
      if (file.user_id === userId) {
        const user = users[userId]; // Retrieve user data
        fileDetails.owner = {
          userId: user.user_id, // Access user_id property
          username: user.username,
          email: user.email,
        };
      }

      // Check if the file is shared with other users
      const sharedFileEntries = Object.values(sharedFiles).filter(
        (sharedFile) => sharedFile.file_id === fileId
      );
      for (const sharedFileEntry of sharedFileEntries) {
        if (sharedFileEntry.shared_with_user_id !== userId) {
          const sharedUser = users[sharedFileEntry.shared_with_user_id]; // Retrieve user data
          fileDetails.sharedWith.push({
            userId: sharedUser.user_id, // Access user_id property
            username: sharedUser.username,
            email: sharedUser.email,
          });
          fileDetails.permissions.push(sharedFileEntry.permission);
        }
      }

      return fileDetails;
    } else {
      return null; // Return null if the file doesn't exist
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
}
async function getMyFiles() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("http://127.0.0.1:8000/my_files", {
      method: "GET",
      headers: headers,
      credentials: "include", // Include cookies in the request
    });
    if (response.ok) {
      const data = await response.json();
      return data; // Return the parsed data
    } else {
      // Handle non-OK response status codes
      if (response.status === 400) {
        // Handle 400 Bad Request error
        throw new Error("User ID cookie is missing");
      } else if (response.status === 500) {
        // Handle 500 Internal Server Error
        throw new Error("Internal Server Error");
      } else {
        // Handle other error cases
        throw new Error("Unexpected Error");
      }
    }
  } catch (err) {
    console.error("Error collecting data:", err);
    throw err;
  }
}

async function Update_password(pass1, pass2, token) {
  // chick the match  of the passwords
  if (!Validate_match_password(pass1, pass2)) return "Password not match";

  try {
    const response = await fetch("http://127.0.0.1:8000/new_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pass1: pass1,
        pass2: pass2,
        token: token,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.msg);

      return data.msg; // Assuming the response contains the success message or error details
    } else {
      throw new Error("Failed to change password. Please try again."); // Throw an error if the request was not successful
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function uploadFile(file, folderId) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/file/${folderId}/upload`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("File upload successful:", data);
      return "File upload successful";
    } else {
      const errorData = await response.json();
      console.error("File upload failed:", errorData);
      throw new Error("File upload failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

async function share_file_with_user(selectedItem, email) {
  // Check the format of the email
  if (!Validate_email_format(email)) return "Email format is not correct.";

  const file_id = selectedItem.id;
  try {
    const response = await fetch(`http://127.0.0.1:8000/share/${file_id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        file_id: file_id,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log(data);
      return data; // Assuming the response contains the success message or error details
    } else {
      const errorData = await response.json();
      throw new Error(
        `Failed to share file. Server returned ${response.status}: ${errorData.detail}`
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
async function get_name() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch("http://127.0.0.1:8000/getName", {
      method: "GET",
      headers: headers,
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      const data = await response.json(); // Parsing response JSON
      return data; // Return the parsed data
    } else {
      if (response.status === 400) {
        // Handle 400 Bad Request error
        throw new Error("User ID cookie is missing");
      } else {
        throw new Error("Unexpected Error");
      }
    }
  } catch (err) {
    console.error("Error collecting data:", err);
    throw err;
  }
}
async function logout() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      headers: headers,
    });
    if (response.ok) {
      const data = await response.json(); // Parsing response JSON
      return data; // Return the parsed data
    } else {
      throw new Error("Unexpected Error");
    }
  } catch (err) {
    throw err;
  }
}
export {
  registerUser,
  LogIn,
  getMyFiles,
  getMyDeletedFiles,
  getMySharedFiles,
  fileDeletion,
  folderDeletion,
  delete_file,
  delete_folder,
  restoreDeletedFile,
  restoreDeletedFolder,
  Forget_password,
  getFileVersions,
  getMyFolders,
  moveFile,
  Update_password,
  download,
  addFolder,
  uploadFile,
  renameFile,
  share_file_with_user,
  get_name,
  logout,
};
