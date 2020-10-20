import React from "react";
import { connect } from "react-redux";
import Directories from "../components/Directories/Directories";
import Notices from "../components/Notices/Notices";
import Toolbar from "../components/Toolbar";
import styled from "styled-components";

import { changeDirectory } from "../redux/actions";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  flex: ${(props) => props.flex || 1};
`;

const Dashboard = (props) => {
  return (
    <Container>
      <ItemContainer flex="1">
        <Toolbar />
      </ItemContainer>
      <ItemContainer flex="4">
        <Directories onChange={(id) => props.changeDirectory(id)} />
      </ItemContainer>
      <ItemContainer flex="10">
        <Notices directoryId={props.directoryId} />
      </ItemContainer>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    directoryId: state.directoryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeDirectory: (id) => dispatch(changeDirectory(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
