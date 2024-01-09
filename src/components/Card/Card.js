import React from "react";
import {
  HeartOutlined,
  PlayCircleOutlined,
  HeartTwoTone,
  HeartFilled,
} from "@ant-design/icons";
import { Card } from "antd";
import defaultImage from "./default-image.jpg";
import "./Card.css";
const { Meta } = Card;

const API_URL = process.env.REACT_APP_API_URL;

const StoriesCard = ({
  story,
  imageUrl,
  onAddToWishlist,
  onPlay,
  isInWishlist,
  isAdmin,
}) => {
  const displayImage =
    imageUrl && imageUrl.includes(`${API_URL}/undefine`)
      ? defaultImage
      : imageUrl;

  const renderHeartIcon = () => {
    if (isAdmin) {
      return <HeartOutlined key="add" style={{ color: "gray" }} />;
    } else if (isInWishlist) {
      return (
        <HeartFilled
          key="add"
          style={{ color: "#ff0000" }}
          onClick={() => onAddToWishlist(story._id)}
        />
      );
    } else {
      return (
        <HeartOutlined key="add" onClick={() => onAddToWishlist(story._id)} />
      );
    }
  };

  console.log(displayImage);
  return (
    <Card
      className="card"
      hoverable
      style={{ width: 240, margin: "10px" }}
      cover={<img alt={story.title} src={displayImage} />}
      actions={[
        // isInWishlist
        // ? <HeartFilled style={{color:'#ff0000'}} key="add" onClick={() => onAddToWishlist(story._id)} />
        // : <HeartOutlined  key="add" onClick={() => onAddToWishlist(story._id)} />,
        renderHeartIcon(),
        <PlayCircleOutlined key="play" onClick={() => onPlay(story._id)} />,
      ]}
    >
      <Meta
        className="meta"
        title={story.title}
        description={`Author: ${story.author}`}
      />
      <p>Genre: {story.genre}</p>
    </Card>
  );
};

export default StoriesCard;
