import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/token", {
                email: email,
                password: password,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            localStorage.setItem("token", response.data.access_token);
            setMessage("Login successful!");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Login failed");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Login
            </Button>
            {message && (
                <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: "20px"}}>
                    {message}
                </Typography>
            )}
        </Container>
    )
}