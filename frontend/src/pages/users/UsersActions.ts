import axiosInstance from "../../axios_instance";

export async function GetUsers() {
    let access_token = localStorage.getItem("access_token")
    if (access_token) {
        return axiosInstance
            .get("/users")
            .then(response => {
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
