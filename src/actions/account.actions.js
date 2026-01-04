import { API_URL } from "constants/api";

export const addBankAccount = async (token, payload={}) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/accounts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        console.log("add new account log =====>>> ", data);

        if (!res.ok) throw new Error(data.message || "Failed to add new account!");

        return {
            success: true,
            message: "Account Added!"
        };
  } catch (error) {
        console.log("Error adding new account:", error);
        return { success: false, error: error.message };
  }
};

export const getBankAccounts = async (token) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/accounts/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        console.log("get accounts log =====>>> ", data);

        if (!res.ok) throw new Error(data.message || "Failed to fetch accounts!");

        return {
            success: true,
            accounts: data || []
        };
  } catch (error) {
        console.log("Error fetching accounts:", error);
        return { success: false, error: error.message };
  }
};

export const updateBankAccount = async (token, id, payload={}) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/accounts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        console.log("update account log =====>>> ", data);

        if (!res.ok) throw new Error(data.message || "Failed to update account!");

        return {
            success: true,
            message: "Account Updated!"
        };
  } catch (error) {
        console.log("Error updating account:", error);
        return { success: false, error: error.message };
  }
};

export const deleteBankAccount = async (token, id) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/accounts/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await res.json();

        console.log("delete account log =====>>> ", data);

        if (!res.ok) throw new Error(data.message || "Failed to delete account!");

        return {
            success: true,
            message: "Account Deleted!"
        };
  } catch (error) {
        console.log("Error deleting account:", error);
        return { success: false, error: error.message };
  }
};
