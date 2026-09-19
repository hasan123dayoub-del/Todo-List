const USERS_URL = "http://localhost:3000/users";
const TASKS_URL = "http://localhost:3000/tasks";

const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
    return await response.json();
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

const getData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
    return await response.json();
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

const deleteData = async (url) => {
  try {
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
  } catch (error) {
    console.error("Error in deleteData:", error);
    throw error;
  }
};

const putData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("HTTP error! status: " + response.status);
    return await response.json();
  } catch (error) {
    console.error("Error in putData:", error);
    throw error;
  }
};
