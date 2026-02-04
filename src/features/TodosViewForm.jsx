import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
`;

const StyledLabel = styled.label`
  margin: 0;
  white-space: nowrap;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
`;

const StyledButton = styled.button`
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 0.5rem;
  padding: 0.45rem 0.75rem;
  color: #e0f2fe;
  font-size: 0.9rem;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.35);
    transform: translateY(-1px);
  }
`;

const StyledSelect = styled.select`
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 0.5rem;
  padding: 0.45rem 0.6rem;
  color: #e5f0ff;
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: rgba(56, 189, 248, 0.8);
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
  }
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  const preventRefresh = (e) => {
    e.preventDefault();
  };

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <StyledLabel htmlFor="search">Search todos:</StyledLabel>
        <StyledInput
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        />
        <StyledButton
          type="button"
          onClick={() => {
            setLocalQueryString("");
          }}
        >
          Clear
        </StyledButton>
      </StyledDiv>
      <StyledDiv>
        <StyledLabel htmlFor="sortField">Sort by</StyledLabel>
        <StyledSelect
          id="sortField"
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
          }}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>
        <StyledLabel htmlFor="sortDirection">Direction</StyledLabel>
        <StyledSelect
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => {
            setSortDirection(e.target.value);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledDiv>
    </StyledForm>
  );
}

export default TodosViewForm;