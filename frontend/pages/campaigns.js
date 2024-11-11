import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useUpdateCampaigns from "@/utils/hooks/useUpdateCampaigns";
import {
  fetchCampaigns,
  updateCampaign,
  createCampaign,
  deleteCampaign,
  searchCampaigns,
} from "@/utils/req/requests";
import { formatDate } from "@/utils/formatDate/FormatDate";

import CampaignForm from "@/components/campaignForm/CampaignForm";
import CampaignTable from "@/components/campaignTable/CampaignTable";
import SearchBar from "@/components/searchBar/SearchBar";
import Pagination from "@/components/pagination/Pagination";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [sortedCampaigns, setSortedCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useUpdateCampaigns(
    currentPage,
    isAscending,
    setCampaigns,
    setSortedCampaigns,
    setTotalPages
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // const campaignData = { name, budget, startDate, endDate };

    const campaignData = {
      name,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    if (editingCampaignId) {
      // Update existing campaign
      const updatedCampaign = await updateCampaign(
        editingCampaignId,
        campaignData
      );

      if (updatedCampaign.error) {
        toast.error(updatedCampaign.error);
      } else {
        setCampaigns(
          campaigns.map((c) =>
            c.id === editingCampaignId ? updatedCampaign : c
          )
        );
        setSortedCampaigns(
          sortedCampaigns.map((c) =>
            c.id === editingCampaignId ? updatedCampaign : c
          )
        );
        toast.success("Campaign updated successfully!");
      }
    } else {
      // Create new campaign
      const createdCampaign = await createCampaign(campaignData);
      if (createdCampaign.error) {
        toast.error(createdCampaign.error);
      } else {
        setCampaigns([...campaigns, createdCampaign]);
        setSortedCampaigns([
          ...(Array.isArray(sortedCampaigns) ? sortedCampaigns : []),
          createdCampaign,
        ]);
        setCurrentPage(1);
        toast.success("Campaign created successfully!");
      }
    }

    setName("");
    setBudget("");
    setStartDate("");
    setEndDate("");
    setEditingCampaignId(null);
  };

  const handleEdit = (campaign) => {
    setName(campaign.name);
    setBudget(campaign.budget);
    setStartDate(formatDate(campaign.startDate));
    setEndDate(formatDate(campaign.endDate));
    setEditingCampaignId(campaign.id);
  };

  const handleDelete = async (id) => {
    const result = await deleteCampaign(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      setCampaigns(campaigns.filter((c) => c.id !== id));
      setSortedCampaigns(sortedCampaigns.filter((c) => c.id !== id));
      toast.success("Campaign deleted successfully!");
    }
  };

  const onSearch = async (query) => {
    if (query) {
      const data = await searchCampaigns(query);
      if (data.error) {
        toast.error(data.error);
      } else {
        setCampaigns(data);
        setSortedCampaigns(
          data.sort((a, b) => {
            const nameA = a.name.toLowerCase() || "";
            const nameB = b.name.toLowerCase() || "";
            return isAscending
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          })
        );
      }
    }
  };

  const onInputChange = (field, value) => {
    if (field === "name") setName(value);
    else if (field === "budget") setBudget(value);
    else if (field === "startDate") setStartDate(value);
    else if (field === "endDate") setEndDate(value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
      {/* CAMPAIGN FORM */}
      <CampaignForm
        onSubmit={handleFormSubmit}
        campaignData={{ name, budget, startDate, endDate }}
        onInputChange={onInputChange}
        editingCampaignId={editingCampaignId}
      />

      {/* SEARCH BAR */}
      <SearchBar onSearch={onSearch} />

      {/* CAMPAIGN TABLE */}
      <CampaignTable
        campaigns={sortedCampaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        toggleSort={() => setIsAscending(!isAscending)}
        isAscending={isAscending}
      />

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Campaigns;
