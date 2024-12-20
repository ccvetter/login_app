import axios from "axios";

export const registerNewUser = (userData: any) => {
    return axios
        .post("users", userData)
        .then(response => {
            let token = JSON.parse(response.data)["token"];
            if (response.data) {
                localStorage.setItem("access_token", token)
            }

            return response;
        })
        .catch(error => {
            if (error.response) {
                return error.response.data;
            } else if (error.message) {
                return error.message;
            } else {
                return error;
            }
        });
};
