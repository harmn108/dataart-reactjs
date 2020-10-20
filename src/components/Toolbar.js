import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
`;

const ContainerItem = styled.div`
  cursor: pointer;
`;

const Toolbar = () => {
  return (
    <Container>
      <ContainerItem>
        <i className="fa fa-plus fa-2x" aria-hidden="true"></i>
        <div>Add</div>
      </ContainerItem>
      <ContainerItem>
        <i className="fa fa-pencil fa-2x" aria-hidden="true"></i>
        <div>Edit</div>
      </ContainerItem>
      <ContainerItem>
        <i className="fa fa-times fa-2x" aria-hidden="true"></i>
        <div>Remove</div>
      </ContainerItem>
    </Container>
  );
};

export default Toolbar;
