import React from "react";
import GlobalStyles from "./styles/globalStyles";
import { ThemeProvider } from "styled-components";
import dark from "./styles/themes/dark";
import light from "./styles/themes/light";

import Routes from './Routes'
const App: React.FC = () => {
    return (
        <ThemeProvider theme={dark}>
            <GlobalStyles />
            <Routes/>
        </ThemeProvider>
    )
};
export default App;