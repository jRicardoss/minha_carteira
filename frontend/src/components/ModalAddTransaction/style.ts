import styled from "styled-components";

export const AddButton = styled.button`
  display:flex
  justify-content: space-around;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 32px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #1d4ed8;
  }
`;

export const OpenButton = styled.button`
  padding: 12px 18px;
  background: #4b59f7;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #353fc0;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalBox = styled.div`
  background: #1e1e2f;
  padding: 25px;
  border-radius: 14px;
  position: relative;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: #b5b5b5;
  }
`;
