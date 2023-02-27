import styled from "styled-components"

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1;
`

export const ModalContainer = styled.div`
  background-color: white;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
`

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`

export const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`

export const Input = styled.input`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 80%;
  margin-bottom: 10px;
`

export const Select = styled.select`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
`

export const TextArea = styled.textarea`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
`

export const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

export const CheckBox = styled.input`
  margin-right: 10px;
`

export const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-right: 10px;
`

export const UploadFile = styled.input`
  margin-top: 5px;
  margin-bottom: 5px;
`
