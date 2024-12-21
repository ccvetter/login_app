import axios from "axios";

export const RegisterNewUser = (userData: any) => {
    return axios
        .post("users", userData)
        .then(response => {
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
