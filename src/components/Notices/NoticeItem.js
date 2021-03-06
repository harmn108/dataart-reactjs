import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useHistory } from "react-router-dom";

const style = {
  cursor: "pointer",
};

const NoticeItem = ({
  id,
  data,
  text,
  moveNotice,
  findNotice,
  viewNotice,
  updateNotice,
  deleteNotice,
}) => {
  const [noticeData, setNoticeData] = useState(data);

  const history = useHistory();

  useEffect(() => {
    setNoticeData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const routeChange = (path) => {
    history.push(path);
  };

  const editModeSwitcher = () => {
    setNoticeData({ ...noticeData, editMode: !noticeData.editMode });
  };

  const _handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      item.title = e.target.value;
      updateNotice(item);
    }
  };

  const originalIndex = findNotice(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveNotice(droppedId, originalIndex);
      }
    },
  });
  const [, drop] = useDrop({
    accept: "card",
    canDrop: () => false,
    hover({ id: draggedId }) {
      if (draggedId !== id) {
        const { index: overIndex } = findNotice(id);
        moveNotice(draggedId, overIndex);
      }
    },
  });
  const opacity = isDragging ? 0 : 1;

  return (
    <span ref={(node) => drag(drop(node))} style={{ opacity }}>
      <span style={{ ...style }} onClick={() => viewNotice(noticeData.id)}>
        <i className="fa fa-tags" aria-hidden="true"></i>
        <i className="fa fa-file-text-o fa-2x" aria-hidden="true"></i>
      </span>
      {noticeData.editMode ? (
        <input
          type="text"
          defaultValue={noticeData.title}
          onKeyDown={(e) => _handleKeyDown(e, noticeData)}
        />
      ) : (
        <>
          <i
            className="fa fa-pencil pointer"
            aria-hidden="true"
            onClick={() => routeChange("/notice/edit/" + noticeData.id)}
          ></i>
          <i
            className="fa fa-trash pointer"
            aria-hidden="true"
            onClick={() => deleteNotice(noticeData.id)}
          ></i>
          <div onDoubleClick={() => editModeSwitcher()}>{noticeData.title}</div>
        </>
      )}
    </span>
  );
};

export default NoticeItem;
