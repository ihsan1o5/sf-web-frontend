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

export const searchStudent = async (token, query, page = 1, limit = 20) => {
  try {
    if (!token) return new Error("User not authenticated");

    const res = await fetch(`${API_URL}/students/search?query=${query}&page=${page}&limit=${limit}`, {
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
    console.log("Error getting search results:", error);
    return { success: false, error: error.message };
  }
};

export const updateStudent = async (token, payload={}, id) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/students/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        console.log("update students log =====>>> ", data);

        if (!res.ok) throw new Error(data.message || "Failed to update student record!");

        return {
            success: true,
            message: "Student updated!"
        };
  } catch (error) {
        console.log("Error updating student:", error);
        return { success: false, error: error.message };
  }
}

export const deleteStudent = async (token, id) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/students/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to delete student record!");

        return {
            success: true,
            message: "Student deleted!"
        };
  } catch (error) {
        console.log("Error deleting student:", error);
        return { success: false, error: error.message };
  }
}

export const getCounts = async (token) => {
  try {
    if (!token) return new Error("User not authenticated");

    const res = await fetch(`${API_URL}/students/get-counts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch counts");

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.log("Error getting counts:", error);
    return { success: false, error: error.message };
  }
}
