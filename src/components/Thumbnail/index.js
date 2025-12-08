import React from "react";
import { getFileIcon } from "utils";

const Thumbnail = ({
  type,
  extension,
  url = ""
}) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className="thumbnail">
      <img
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={`size-8 object-contain ${isImage ? "thumbnail-image" : ""}`}
      />
    </figure>
  );
};

export default Thumbnail;
