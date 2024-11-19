import { useState, useEffect } from "react";
import { fetchCampaigns } from "@/utils/req/requests";

const useInfiniteScrollCampaigns = (isAscending, setCampaigns) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreCampaigns = async () => {
    if (loading) return;
    setLoading(true);

    setTimeout(async () => {
      const data = await fetchCampaigns(
        page,
        process.env.NEXT_PUBLIC_NUMBER_OF_ITEMS
      );
      if (data.data.length === 0) setHasMore(false);

      const sortedData = data.data.sort((a, b) => {
        const nameA = a.name.toLowerCase() || "";
        const nameB = b.name.toLowerCase() || "";
        return isAscending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      setCampaigns((prevCampaigns) => [...prevCampaigns, ...sortedData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    loadMoreCampaigns();
  }, [isAscending]);

  return { loadMoreCampaigns, hasMore, loading };
};

export default useInfiniteScrollCampaigns;
