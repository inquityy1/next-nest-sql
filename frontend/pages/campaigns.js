import { useEffect, useState } from "react";
import useCampaigns from "@/utils/hooks/useCampaigns";

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
  } = useCampaigns();

  useEffect(() => {
    fetch("http://localhost:3000/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setSortedCampaigns(data);
      });
  }, []);

  const filteredCampaigns = sortedCampaigns.filter(
    (campaign) =>
      campaign.name &&
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (campaigns) => {
    const startIndex = (currentPage - 1) * campaignsPerPage;
    const endIndex = startIndex + campaignsPerPage;
    return campaigns.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);
  const displayedCampaigns = paginate(filteredCampaigns);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCampaign = {
      name,
      budget: Number(budget),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(startDate).toISOString(),
    };

    if (editingCampaignId) {
      // Update existing campaign
      const response = await fetch(
        `http://localhost:3000/campaigns/${editingCampaignId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCampaign),
        }
      );
      const updatedCampaign = await response.json();
      setCampaigns(
        campaigns.map((c) => (c.id === editingCampaignId ? updatedCampaign : c))
      );
      setSortedCampaigns(
        sortedCampaigns.map((c) =>
          c.id === editingCampaignId ? updatedCampaign : c
        )
      );
    } else {
      // Create new campaign
      const response = await fetch("http://localhost:3000/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaign),
      });
      const createdCampaign = await response.json();
      setCampaigns([...campaigns, createdCampaign]);
      setSortedCampaigns([...sortedCampaigns, createdCampaign]);
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
    await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "DELETE",
    });

    setCampaigns(campaigns.filter((c) => c.id !== id));
    setSortedCampaigns(sortedCampaigns.filter((c) => c.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const sortCampaigns = () => {
    const sorted = [...sortedCampaigns].sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";

      return isAscending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setSortedCampaigns(sorted);
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
    sortCampaigns();
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
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
          {displayedCampaigns.map((campaign) => (
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
          ))}
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
