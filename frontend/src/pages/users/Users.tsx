import { useEffect, useState } from "react";
import { GetUsers } from "./UsersActions";
import { ColumnProps } from "../../types/ColumnProps";
import Table from "../../components/table/Table";
import Layout from "../../components/Layout";

type Data = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    birthdate: string;
    is_admin: boolean;
    is_staff: boolean;
}

export default function Users() {
    const [data, setData] = useState([]);
    const columns: Array<ColumnProps<Data>> = [
      {
        key: "username",
        title: "Username",
      },
      {
        key: "email",
        title: "Email",
      },
      {
        key: "first_name",
        title: "First Name",
      },
      {
        key: "last_name",
        title: "Last Name",
      },
      {
        key: "birthdate",
        title: "Birthdate",
      },
      {
        key: "is_admin",
        title: "Admin",

        render: (_, record) => {
          return (
            <div className="text-blue-500 font-bold">
              {record.is_admin ? "true" : "false"}
            </div>
          );
        },
      },
      {
        key: "is_staff",
        title: "Staff",

        render: (_, record) => {
          return (
            <div className="text-blue-500 font-bold">
              {record.is_staff ? "true" : "false"}
            </div>
          );
        },
      },
    ];

    useEffect(() => {
        GetUsers().then((response) => {
            if (response.data) {
                setData(response.data);
            }
        })
    }, [])

     return (
        <Layout>
          <Table data={data} columns={columns} />
        </Layout>
     )
}
