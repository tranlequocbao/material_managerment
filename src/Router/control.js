import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "../login/Components/Login";
import Dashboard from "../dashboard";

const msnv = localStorage.getItem('msnv');

const Control = () => {
    return (
        <BrowserRouter>
            <Routes>
                {msnv && <Route path="/" exact element={<Dashboard />} />}
                {!msnv && <Route path="/" element={<Login />} />}
                
            </Routes>
        </BrowserRouter>
    );
};

export default Control;