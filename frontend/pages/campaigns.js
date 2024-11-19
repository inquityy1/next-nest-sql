import { useState } from "react";
import { toast } from "react-toastify";

import useUpdateCampaigns from "@/utils/hooks/useUpdateCampaigns";
import {
  updateCampaign,
  createCampaign,
  deleteCampaign,
  searchCampaigns,
} from "@/utils/req/requests";
import { formatDate } from "@/utils/formatDate/FormatDate";
import useInfiniteScrollCampaigns from "@/utils/hooks/useInfiniteScrollCampaigns";

import CampaignForm from "@/components/campaignForm/CampaignForm";
import CampaignTable from "@/components/campaignTable/CampaignTable";
import SearchBar from "@/components/searchBar/SearchBar";
import Pagination from "@/components/pagination/Pagination";
import InfiniteScroll from "@/components/infiniteScrollTable/InfiniteScrollTable";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [infiniteCampaigns, setInfiniteCampaigns] = useState([]);

  const updateCampaigns = useUpdateCampaigns(
    currentPage,
    isAscending,
    setCampaigns,
    setTotalPages
  );

  const { loadMoreCampaigns, hasMore, loading } = useInfiniteScrollCampaigns(
    isAscending,
    setInfiniteCampaigns
  );

  const resetForm = () => {
    setName("");
    setBudget("");
    setStartDate("");
    setEndDate("");
    setQuery("");
    setEditingCampaignId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
        toast.success("Campaign updated successfully!");
        await updateCampaigns();
      }
    } else {
      // Create new campaign
      const createdCampaign = await createCampaign(campaignData);
      if (createdCampaign.error) {
        toast.error(createdCampaign.error);
      } else {
        setCampaigns([...campaigns, createdCampaign]);

        toast.success("Campaign created successfully!");
        await updateCampaigns();
      }
    }

    resetForm();
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
      toast.success("Campaign deleted successfully!");
      await updateCampaigns();
      resetForm();
    }
  };

  const onSearch = async (query) => {
    if (query) {
      const data = await searchCampaigns(query);
      if (data.error) {
        toast.error(data.error);
      } else {
        setCampaigns(data);
      }
    } else {
      await updateCampaigns();
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
      {/* CAMPAIGN TABLE WITH PAGINATION */}
      <>
        {/* CAMPAIGN FORM */}
        <CampaignForm
          onSubmit={handleFormSubmit}
          campaignData={{ name, budget, startDate, endDate }}
          onInputChange={onInputChange}
          editingCampaignId={editingCampaignId}
        />

        {/* SEARCH BAR */}
        <SearchBar onSearch={onSearch} query={query} setQuery={setQuery} />

        {/* CAMPAIGN TABLE */}
        <CampaignTable
          campaigns={campaigns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          toggleSort={() => setIsAscending(!isAscending)}
          sortButton={true}
          isAscending={isAscending}
        />

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
      {/* CAMPAIGN TABLE WITH INFINITE SCROLL */}
      <>
        <h2 className="text-xl font-bold mt-8 mb-4">
          Infinite Scroll Campaigns
        </h2>
        <CampaignTable
          campaigns={infiniteCampaigns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          toggleSort={() => setIsAscending(!isAscending)}
          isAscending={isAscending}
        />
        <InfiniteScroll
          loadMore={loadMoreCampaigns}
          hasMore={hasMore}
          loading={loading}
        />
      </>
    </div>
  );
};

export default Campaigns;
