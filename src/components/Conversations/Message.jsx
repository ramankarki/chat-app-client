import React from "react";

function Message(props) {
  return (
    <p className={"single-message " + props.className} title={props.title}>
      {props.msg}
    </p>
  );
}

export default Message;
