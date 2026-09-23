import styled from "styled-components";

/*

========== Layout ===========

MH = Main Header

AS = Aside

CT = Content

*/

export const Grid = styled.div`
display: grid;


grid-template-columns: 250px minmax(0, 1fr);
grid-template-rows: 70px minmax(0, 1fr);

grid-template-areas:
    "AS MH"
    "AS CT";

height: 100vh;

overflow: hidden;

@media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 70px minmax(0, 1fr);

    grid-template-areas:
        "MH"
        "CT";
}


`;

export const Overlay = styled.div`
display: none;


@media (max-width: 768px) {
    display: block;

    position: fixed;

    inset: 0;

    background-color: rgba(0, 0, 0, 0.2);

    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    z-index: 90;
}


`;
