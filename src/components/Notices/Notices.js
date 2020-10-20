import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar.js";
import Notice from "./Notice.js";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;

const Notices = (props) => {
  const [noticesData, setNoticesData] = useState([]);

  useEffect(() => {
    if (props.directoryId) {
      console.log("Notices", props.directoryId);
      // addNotice(1);
      getNoticesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.directoryId]);

  const getNoticesData = () => {
    axios
      .get("http://localhost:3001/notices")
      .then((res) => {
        if (res.data && res.data.length) {
          setNoticesData(
            res.data.filter(
              (notice) => notice.directoryId === props.directoryId
            )
          );
        }
        setNoticesData((state) => {
          return state;
        });
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const addNotice = (
    directoryId,
    title = "test notice 9",
    description = "test description 1",
    tags = ["test tag 1", "test tag 1"]
  ) => {
    console.log();
    axios
      .post("http://localhost:3001/notices", {
        directoryId,
        title,
        description,
        tags,
      })
      .then((res) => {})
      .catch((error) => {
        console.log("error:", error);
      });
  };

  let noticesList = null;
  if (noticesData && noticesData.length) {
    noticesList = noticesData.map((notice) => (
      <Notice key={notice.id} data={notice} />
    ));
  }

  return (
    <Container>
      {noticesList}
      {/* <div><SearchBar/></div> */}
    </Container>
  );
};

export default Notices;
