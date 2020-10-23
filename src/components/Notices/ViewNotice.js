import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewNotice = (props) => {
  const [noticeData, setNoticeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedNoticeId =
    props.match && props.match.params && props.match.params.id
      ? parseInt(props.match.params.id, 10)
      : 0;

  useEffect(() => {
    if (selectedNoticeId) {
      getNoticeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNoticeData = () => {
    axios
      .get("http://localhost:3001/notices")
      .then((res) => {
        if (res.data && res.data.length) {
          const noticeDataArray = res.data.filter(
            (notice) => notice.id === selectedNoticeId
          );
          setNoticeData(
            noticeDataArray && noticeDataArray[0] ? noticeDataArray[0] : null
          );
          setNoticeData((state) => {
            setLoading(false);
            return state;
          });
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  return <div>{!loading ? <div>{JSON.stringify(noticeData)}</div> : null}</div>;
};

export default ViewNotice;
