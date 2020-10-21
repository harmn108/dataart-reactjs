import React from "react";
import { connect } from "react-redux";
import Directories from "../components/Directories/Directories";
import Notices from "../components/Notices/Notices";
import Toolbar from "../components/Toolbar";
import styled from "styled-components";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { changeDirectory } from "../redux/actions";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  flex: ${(props) => props.flex || 1};
`;

const Dashboard = (props) => {
  const selectedDirectoryId = (props.match && props.match.params && props.match.params.id) ? props.match.params.id : 0
  return (
    <Container>
      <ItemContainer flex="1">
        <Toolbar />
      </ItemContainer>
      <ItemContainer flex="4">
        <Directories selectedDirectoryId={selectedDirectoryId} onChange={(id) => props.changeDirectory(id)} />
      </ItemContainer>
      <ItemContainer flex="10">
        <DndProvider backend={HTML5Backend}>
          <Notices directoryId={props.directoryId} />
        </DndProvider>
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
