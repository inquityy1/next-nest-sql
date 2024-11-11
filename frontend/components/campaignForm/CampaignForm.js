import React from "react";

const CampaignForm = ({
  onSubmit,
  campaignData,
  onInputChange,
  editingCampaignId,
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Name"
        value={campaignData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Budget"
        value={campaignData.budget}
        onChange={(e) => onInputChange("budget", e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        placeholder="Start Date"
        value={campaignData.startDate}
        onChange={(e) => onInputChange("startDate", e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        placeholder="End Date"
        value={campaignData.endDate}
        onChange={(e) => onInputChange("endDate", e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        {editingCampaignId ? "Update Campaign" : "Create Campaign"}
      </button>
    </form>
  );
};

export default CampaignForm;
