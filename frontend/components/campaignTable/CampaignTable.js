import React from "react";
import { formatDate } from "@/utils/formatDate/FormatDate";

const CampaignTable = ({
  campaigns,
  onEdit,
  onDelete,
  isAscending,
  toggleSort,
}) => (
  <div>
    <button
      onClick={toggleSort}
      className="bg-green-500 text-white rounded px-2 py-1 mr-2 mt-2 mb-2"
    >
      Sort {isAscending ? "Z-A" : "A-Z"}
    </button>
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
                  onClick={() => onEdit(campaign)}
                  className="bg-yellow-500 text-white rounded px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(campaign.id)}
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
  </div>
);

export default CampaignTable;
