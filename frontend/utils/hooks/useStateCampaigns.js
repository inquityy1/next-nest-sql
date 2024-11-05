import { useState } from "react";

const useCampaignsCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [sortedCampaigns, setSortedCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  return {
    campaigns,
    sortedCampaigns,
    name,
    budget,
    startDate,
    endDate,
    editingCampaignId,
    currentPage,
    isAscending,
    searchQuery,
    totalPages,
    setCampaigns,
    setSortedCampaigns,
    setName,
    setBudget,
    setStartDate,
    setEndDate,
    setEditingCampaignId,
    setCurrentPage,
    setIsAscending,
    setSearchQuery,
    setTotalPages,
  };
};

export default useCampaignsCampaigns;
