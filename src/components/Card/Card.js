import React from "react";
import { HeartOutlined, PlayCircleOutlined, HeartTwoTone } from "@ant-design/icons";
import { Card } from "antd";
import defaultImage from "./default-image.jpg"
import './Card.css'
const { Meta } = Card;


const StoriesCard = ({ story, imageUrl, onAddToWishlist, onPlay, isInWishlist }) => {
  const displayImage = imageUrl && imageUrl.includes("localhost:8001/undefine") ? defaultImage : imageUrl;
  console.log(displayImage);
  return (
    <Card className="card"
      hoverable
      style={{ width: 240, margin: "10px" }}
      cover={<img alt={story.title} src={displayImage} />}
      actions={[
        <HeartTwoTone 
          twoToneColor={isInWishlist ? "#ff0000" : "#808080"} 
          key="add" 
          onClick={() => onAddToWishlist(story._id)} 
        />,
        <PlayCircleOutlined key="play" onClick={() => onPlay(story._id)} />,
      ]}
    >
      <Meta className="meta" title={story.title} description={`Author: ${story.author}`} />
      <p>Genre: {story.genre}</p>
    </Card>
  );
};

export default StoriesCard;
