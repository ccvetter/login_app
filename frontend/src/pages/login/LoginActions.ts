import axios from "axios";

export async function LoginUser(userData: any) {
    if (userData) {
        return axios
            .post("login", userData)
            .then(response => {
                if (response.data) {
                    let data = response.data
                    let access_token = data["access_token"]
                    let refresh_token = data["refresh_token"]
                    localStorage.setItem("access_token", access_token)
                    localStorage.setItem("refresh_token", refresh_token)
                }

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
