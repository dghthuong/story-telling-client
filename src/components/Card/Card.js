import React from "react";
import { HeartOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";
const { Meta } = Card;

const StoriesCard = ({ story, imageUrl, onAddToWishlist, onPlay }) => {
  //console.log("Image URL:", imageUrl);
  return (
    <Card
      hoverable
      style={{ width: 240, margin: "10px" }}
      cover={<img alt={story.title} src={imageUrl} />}
      actions={[
        <HeartOutlined key="add" onClick={() => onAddToWishlist(story._id)} />,
        <PlayCircleOutlined key="play" onClick={() => onPlay(story._id)} />,
      ]}
    >
      <Meta title={story.title} description={`Author: ${story.author}`} />
      <p>Genre: {story.genre}</p>
      {/* Add any other information you want to display */}
    </Card>
  );
};

export default StoriesCard;
