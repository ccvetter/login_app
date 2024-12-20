import { useEffect } from "react";
import { GetUsers } from "./UsersActions";

export default function Users() {
    useEffect(() => {
        GetUsers().then((response) => {
            console.log(response);
        })
    }, [])

     return (
        <section className="bg-gray-50 dark:bg-gray-900"></section>
     )
}