import { useEffect, useState } from "react";
import useCampaignsCampaigns from "@/utils/hooks/useStateCampaigns";
import {
  fetchCampaigns,
  updateCampaign,
  createCampaign,
  deleteCampaign,
  searchCampaigns,
} from "@/utils/req/requests";
import { toast } from "react-toastify";
import { debounce } from "@/utils/debounce/debounce";

const Campaigns = () => {
  const {
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
  } = useCampaignsCampaigns();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCampaign = {
      name,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    if (editingCampaignId) {
      // Update existing campaign
      const updatedCampaign = await updateCampaign(
        editingCampaignId,
        newCampaign
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
      const createdCampaign = await createCampaign(newCampaign);
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

    // Re-fetch to get updated pagination after create
    updateCampaigns();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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
      // Re-fetch to get updated pagination after delete
      updateCampaigns();
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const debouncedSearch = debounce(async (query) => {
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
    } else {
      updateCampaigns();
    }
  }, 500);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          {editingCampaignId ? "Update Campaign" : "Create Campaign"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Campaigns"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={toggleSort}
          className="bg-green-500 text-white rounded px-2 py-1 mr-2"
        >
          Sort {isAscending ? "Z-A" : "A-Z"}
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b py-2 text-left px-4">Name</th>
            <th className="border-b py-2 text-left px-4">Budget</th>
            <th className="border-b py-2 text-left px-4">Start Date</th>
            <th className="border-b py-2 text-left px-4">End Date</th>
            <th className="border-b py-2 text-left px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="border-b py-2 px-4">{campaign.name}</td>
                <td className="border-b py-2 px-4">${campaign.budget}</td>
                <td className="border-b py-2 px-4">
                  {formatDate(campaign.startDate)}
                </td>
                <td className="border-b py-2 px-4">
                  {formatDate(campaign.endDate)}
                </td>
                <td className="border-b py-2 px-4">
                  <button
                    onClick={() => handleEdit(campaign)}
                    className="bg-yellow-500 text-white rounded px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="bg-red-500 text-white rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border-b py-2 px-4 text-center">
                No campaigns found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 rounded px-2 py-1"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 rounded px-2 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Campaigns;
