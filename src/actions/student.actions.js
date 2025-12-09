import { API_URL } from "constants/api";

export const getStudentsBySchool = async (token, page = 1, limit = 20) => {
  try {
    if (!token) return new Error("User not authenticated");

    const res = await fetch(`${API_URL}/students/get-by-school?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch students");

    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.log("Error getting students:", error);
    return { success: false, error: error.message };
  }
};
