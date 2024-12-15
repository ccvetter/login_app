import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";

export default function Protected() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProtected = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You are not logged in.");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/protected", {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response?.data?.detail || "Access denied");
            }
        };

        fetchProtected();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setMessage("You have been logged out.");
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Protected Route
            </Typography>
            <Typography variant="body1" align="center">
                {message}
            </Typography>
            {localStorage.getItem("token") && (
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    style={{ marginTop: "20px" }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            )}
        </Container>
    );
}
