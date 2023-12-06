import React from "react";
import { Container } from "./style";
interface LayoutProps {
    children: React.ReactNode;
  }
const Content: React.FC<LayoutProps> = ({ children }) => (
            <Container>
                {children}
            </Container>
    )

export default Content;