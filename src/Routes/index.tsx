import React from "react";
import {BrowserRouter}from'react-router-dom'

import App from './App.routes'
import Auth from './auth.routes'


const Routes: React.FC = () => (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);
export default Routes;