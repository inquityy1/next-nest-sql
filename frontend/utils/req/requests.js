const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/campaigns`;

export const fetchCampaigns = async (page, limit) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  const data = await response.json();
  return data;
};

export const createCampaign = async (campaignData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaignData),
  });
  return await response.json();
};

export const updateCampaign = async (id, campaignData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaignData),
  });
  return await response.json();
};

export const deleteCampaign = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};

export const searchCampaigns = async (name) => {
  const response = await fetch(`${BASE_URL}/search?name=${name}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};
