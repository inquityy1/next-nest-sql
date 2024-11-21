const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const fetchUsers = async (token, currentUsername) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }

    const users = await response.json();
    return users.filter((user) => user.username !== currentUsername);
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchChatHistory = async (username1, username2, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/chat/history/${username1}/${username2}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat history.");
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signupUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign up.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
