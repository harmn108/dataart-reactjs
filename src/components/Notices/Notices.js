import React, { useEffect, useState } from "react";
// import SearchBar from "../SearchBar.js";
import Notice from "./Notice.js";
import styled from "styled-components";
import axios from "axios";
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';

const Container = styled.div`
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;

const Notices = (props) => {
  const [noticesData, setNoticesData] = useState([]);

  useEffect(() => {
    if (props.directoryId) {
      getNoticesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.directoryId]);

  const getNoticesData = () => {
    axios
      .get("http://localhost:3001/notices")
      .then((res) => {
        if (res.data && res.data.length) {
            let currentNoticesData = res.data.filter((notice) => notice.directoryId === props.directoryId);
            currentNoticesData.sort((a, b) => a.position - b.position);
            setNoticesData(currentNoticesData);
        } 
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  // const addNotice = (
  //   directoryId,
  //   title = "test notice 2",
  //   description = "test description 2",
  //   tags = ["test tag 2", "test tag 2"]
  // ) => {
  //   axios
  //     .post("http://localhost:3001/notices", {
  //       directoryId,
  //       title,
  //       description,
  //       tags,
  //     })
  //     .then((res) => {})
  //     .catch((error) => {
  //       console.log("error:", error);
  //     });
  // };

  const updateNotice = (notice) => {
    axios.put('http://localhost:3001/notices/' + notice.id, {
      id: notice.id,
      directoryId: notice.directoryId,
      position: notice.position,
      title: notice.title,
      description: notice.description,
      tags: notice.tags
    }).then(result => {
        setNoticesData(noticesData.filter((item, index) => {
          if (item.id === notice.id) {
            notice.editMode = false;
            noticesData[index] = notice;
          }
          return item;
        }));
    });
  };

  const deleteNotice = (id) => {
    axios
      .delete("http://localhost:3001/notices/" + id)
      .then((res) => {
        setNoticesData(noticesData.filter(item => item.id !== id));
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const reorderNoticesData = (updatedNoticesData) => {
    if (updatedNoticesData && updatedNoticesData.length) {
        updatedNoticesData.forEach((data, index) => {
          axios.put('http://localhost:3001/notices/' + data.id, {
              id: data.id,
              directoryId: data.directoryId,
              position: index,
              title: data.title,
              description: data.description,
              tags: data.tags
          }).then(data => {
              // console.log(data);
          });
        });
    }
  };

    const moveNotice = (id, atIndex) => {
        const { notice, index } = findNotice(id);
        setNoticesData(update(noticesData, {
            $splice: [
                [index, 1],
                [atIndex, 0, notice],
            ],
        }));

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
    
    const [, drop] = useDrop({ accept: 'card' });

    let noticesList = null;
    if (noticesData && noticesData.length) {
        noticesList = noticesData.map((notice) => (
            <Notice key={notice.id} data={notice} id={`${notice.id}`} text={notice.text} moveNotice={moveNotice} findNotice={findNotice} updateNotice={updateNotice} deleteNotice={deleteNotice}/>
        ));
    }

  return (
    <Container ref={drop}>
            {noticesList}
      {/* <div><SearchBar/></div> */}
    </Container>
  );
};

export default Notices;