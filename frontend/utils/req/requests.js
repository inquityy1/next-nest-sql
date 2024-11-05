const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/campaigns`;

export const fetchCampaigns = async (page, limit) => {
  try {
    const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch campaigns.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export const createCampaign = async (campaignData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create campaign.");
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const updateCampaign = async (id, campaignData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update campaign.");
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteCampaign = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete campaign.");
    }

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

export const searchCampaigns = async (name) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?name=${encodeURIComponent(name)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search campaigns.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};
