import React from "react";
import ReactPlayer from "react-player/youtube";

const YouTubePlayer = ({ url }) => {
    return (
    <div className="">
      <ReactPlayer
        url={url}
        playing={true}
        loop={true}
        muted
        width="100%"
        controls={true}
      />
    </div>
  );
};


export default YouTubePlayer;
