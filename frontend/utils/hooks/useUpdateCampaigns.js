import { useEffect } from "react";
import { fetchCampaigns } from "@/utils/req/requests";

const useUpdateCampaigns = (
  currentPage,
  isAscending,
  setCampaigns,
  setSortedCampaigns,
  setTotalPages
) => {
  const updateCampaigns = async () => {
    const data = await fetchCampaigns(
      currentPage,
      process.env.NEXT_PUBLIC_NUMBER_OF_ITEMS
    );

    const sortedData = data.data.sort((a, b) => {
      const nameA = a.name.toLowerCase() || "";
      const nameB = b.name.toLowerCase() || "";

      return isAscending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setCampaigns(data.data);
    setSortedCampaigns(sortedData);
    setTotalPages(
      Math.ceil(data.total / process.env.NEXT_PUBLIC_NUMBER_OF_ITEMS)
    );
  };

  useEffect(() => {
    updateCampaigns();
  }, [currentPage, isAscending]);

  return updateCampaigns;
};

export default useUpdateCampaigns;
