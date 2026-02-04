import { forwardRef } from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
  margin: 0;
  padding: 0.5rem;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, label, onChange, value },
  ref
) {
  return (
    <StyledContainer>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </StyledContainer>
  );
});

export default TextInputWithLabel;

