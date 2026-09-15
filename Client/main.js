const url = "http://localhost:3000/users/";


// // GET request
// fetch(url, {
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json"
//     }
// }).then((response) => {
//     return response.json();
// }).then((data) => {
//     console.log(data);
// });


// // POST request
// fetch(url, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         name: "John Doe",
//         email: "john.doe@example.com",
//         password: "password123"
//     })
// }).then((response) => {
//     return response.json();
// }).then((data) => {
//     console.log(data);
// });


// // PUT request
// fetch(url + "/1", {
//     method: "PUT",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         name: "John Doe",
//         email: "john.doe@example.com",
//         password: "password123"

//     })
// }).then((response) => {
//     return response.json();
// }).then((data) => {
//     console.log(data);
// });


// // DELETE request
// fetch(url + "/1", {
//     method: "DELETE",
//     headers: {
//         "Content-Type": "application/json"
//     }
// }).then((response) => {
//     return response.json();
// }).then((data) => {
//     console.log(data);
// });

const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } console.log(response);
    } catch (error) {
        console.error('Error:', error);
    }
    return response.json();
}

const getData = async (url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const putData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const deleteData = async (url) => {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

