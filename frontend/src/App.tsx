import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
  // return (
  //   <RouterProvider router={router} />
  // );
}

export default App;
