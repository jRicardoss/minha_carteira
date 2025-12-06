import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => props.theme.color.white};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 12px;
  background-color: #3b82f6;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #1d4ed8;
  }
`;

/* --- Checkbox --- */

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CheckBox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const CheckBoxLabel = styled.label`
  font-size: 16px;
`;
