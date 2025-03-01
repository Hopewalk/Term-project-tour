import React, { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useParams } from "react-router";
import { Rate, Card, Button, Input, message } from "antd";
import PaginationComponent from "../../Component/Pagination/PaginationComponent";

export default function Review() {
  const { state } = useContext(AuthContext);
  const { documentId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [tours, settour] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await ax.get(
        `/tours/${documentId}?populate[reviews][populate]=users_permissions_user`
      );

      if (response.data?.data) {
        setReviews(response.data.data.reviews || []);
        settour(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [documentId]);

  const handleSubmitReview = async () => {
    if (!state.user) {
      message.error("กรุณาเข้าสู่ระบบก่อนทำการรีวิว");
      return;
    }

    if (newRating === 0) {
      alert("โปรดให้ดาวก่อนกดส่ง");
      return;
    }
    setLoading(true);
    try {
      const newReview = {
        data: {
          users_permissions_user: state.user?.id || "Guest",
          rating: newRating,
          comment: newComment,
          tour: tours?.documentId || "Unknown Tour",
        },
      };

      await ax.post("/reviews", newReview);
      setReviews([
        ...reviews,
        { ...newReview.data, users_permissions_user: state.user },
      ]);
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewDocumentId) => {
    setLoading(true);
    try {
      await ax.delete(`/reviews/${reviewDocumentId}`);
      setReviews(
        reviews.filter((review) => review.documentId !== reviewDocumentId)
      );
      message.success("Review deleted successfully");
    } catch (error) {
      console.error("Failed to delete review:", error);
      message.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, documentId]);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white">
      <div className="pt-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="space-y-6">
          {paginatedReviews.map((review, index) => (
            <Card key={index} className="p-4 relative">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    {review.users_permissions_user
                      ? review.users_permissions_user.username
                      : "Anonymous"}
                  </h3>
                  <Rate disabled defaultValue={review.rating} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
                {state.user?.id === review.users_permissions_user?.id && (
                  <Button
                    type="link"
                    onClick={() => handleDeleteReview(review.documentId)}
                    loading={loading}
                    className="absolute bottom-2 right-2"
                  >
                    ลบ
                  </Button>
                )}
              </div>
            </Card>
          ))}

          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            total={reviews.length}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} reviews`
            }
            onChange={setCurrentPage}
          />

          {state.user ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Rating & Review</h3>
              <Rate value={newRating} onChange={setNewRating} />
              <Input.TextArea
                placeholder="Share your experience..."
                className="min-h-[100px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                type="primary"
                block
                onClick={handleSubmitReview}
                loading={loading}
              >
                Submit Review
              </Button>
            </div>
          ) : (
            <p className="text-red-500">กรุณาเข้าสู่ระบบก่อนทำการรีวิว</p>
          )}
        </div>
      </div>
    </div>
  );
}
