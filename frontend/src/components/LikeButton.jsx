import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const LikeButton = ({ bookId, initialLikes = 0, initialLiked = false }) => {
  const { currentUser } = useAuth();

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`/books/${bookId}/like`, {
        userId: currentUser.id || currentUser._id,
      });

      setLikes(res.data.book.likes.length);
      setLiked(res.data.liked);

    } catch (err) {
      console.log(err);
      toast.error("Like failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1 text-red-500"
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;
