import { useRef, useCallback } from "react";
import { ClipLoader } from "react-spinners";

const InfiniteScroll = ({ loadMore, hasMore, loading }) => {
  const observer = useRef();

  const lastCampaignElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <div>
      <div ref={lastCampaignElementRef} />
      {loading && (
        <div className="flex justify-center mt-4">
          <ClipLoader color="#4A90E2" loading={loading} size={35} />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
