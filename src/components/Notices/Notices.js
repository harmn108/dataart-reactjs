import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import SearchBar from "../SearchBar.js";
import NoticeItem from "./NoticeItem.js";
import styled from "styled-components";
import axios from "axios";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 24px;
`;

const AddContainer = styled.div`
  // padding: 24px;
`;

const Notices = (props) => {
  const [noticesData, setNoticesData] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (props.directoryId) {
      getNoticesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.directoryId]);

  const routeChange = (path) => {
    history.push(path);
  };

  const getNoticesData = () => {
    axios
      .get("http://localhost:3001/notices")
      .then((res) => {
        if (res.data && res.data.length) {
          let currentNoticesData = res.data.filter(
            (notice) => notice.directoryId === props.directoryId
          );
          currentNoticesData.sort((a, b) => a.position - b.position);
          setNoticesData(currentNoticesData);
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const addNotice = () => {
    routeChange("/notice/add?directoryId=" + props.directoryId);
  };

  const viewNotice = (id) => {
    routeChange("/notice/" + id);
  };

  const updateNotice = (notice) => {
    axios
      .put("http://localhost:3001/notices/" + notice.id, {
        id: notice.id,
        directoryId: notice.directoryId,
        position: notice.position,
        title: notice.title,
        description: notice.description,
        tags: notice.tags,
      })
      .then((result) => {
        setNoticesData(
          noticesData.map((item, index) => {
            if (item.id === notice.id) {
              notice.editMode = false;
              item = notice;
            }
            return item;
          })
        );
      });
  };

  const deleteNotice = (id) => {
    axios
      .delete("http://localhost:3001/notices/" + id)
      .then((res) => {
        setNoticesData(noticesData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const reorderNoticesData = (updatedNoticesData) => {
    if (updatedNoticesData && updatedNoticesData.length) {
      updatedNoticesData.forEach((data, index) => {
        axios
          .put("http://localhost:3001/notices/" + data.id, {
            id: data.id,
            directoryId: data.directoryId,
            position: index,
            title: data.title,
            description: data.description,
            tags: data.tags,
          })
          .then((data) => {
            // console.log(data);
          });
      });
    }
  };

  const moveNotice = (id, atIndex) => {
    const { notice, index } = findNotice(id);
    setNoticesData(
      update(noticesData, {
        $splice: [
          [index, 1],
          [atIndex, 0, notice],
        ],
      })
    );

    setNoticesData((state) => {
      reorderNoticesData(state);
      return state;
    });
  };

  const findNotice = (id) => {
    const notice = noticesData.filter((c) => `${c.id}` === id)[0];
    return {
      notice,
      index: noticesData.indexOf(notice),
    };
  };

  const [, drop] = useDrop({ accept: "card" });

  let noticesList = null;
  if (noticesData && noticesData.length) {
    noticesList = noticesData.map((notice) => (
      <NoticeItem
        key={notice.id}
        data={notice}
        id={`${notice.id}`}
        text={notice.text}
        moveNotice={moveNotice}
        findNotice={findNotice}
        viewNotice={viewNotice}
        updateNotice={updateNotice}
        deleteNotice={deleteNotice}
      />
    ));
  }

  return (
    <>
      <AddContainer>
        <i
          className="fa fa-plus-circle fa-2x pointer"
          aria-hidden="true"
          onClick={() => addNotice()}
        ></i>
        add notice
      </AddContainer>
      <Container ref={drop}>
        {noticesList}
        {/* <div><SearchBar/></div> */}
      </Container>
    </>
  );
};

export default Notices;
