import axios from "axios";

export async function GetUsers() {
    let access_token = localStorage.getItem("access_token")
    if (access_token) {
        return axios
            .get("/")
            .then(response => {
                console.log(response.data)
                
                return response;
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data);
                } else if (error.message) {
                    console.error(error.message);
                } else {
                    console.error(error);
                }

                return error;
            });
    }
};