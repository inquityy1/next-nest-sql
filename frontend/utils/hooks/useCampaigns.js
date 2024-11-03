import { useState, useEffect } from "react";

const useCampaigns = () => {
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
  const campaignsPerPage = 5;

  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch("http://localhost:3000/campaigns");
      const data = await response.json();
      setCampaigns(data);
      setSortedCampaigns(data);
    };

    fetchCampaigns();
  }, []);

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
    campaignsPerPage,
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
  };
};

export default useCampaigns;
