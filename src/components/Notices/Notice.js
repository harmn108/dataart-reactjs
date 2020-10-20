import React from "react";

const Notice = (props) => {
  return (
    <span>
      <i className="fa fa-tags" aria-hidden="true"></i>
      <i className="fa fa-file-text-o fa-2x" aria-hidden="true"></i>
      <div>{props.data.id}</div>
    </span>
  );
};

export default Notice;
