import { API_URL } from "constants/api";

export const getStudentsBySchool = async (token) => {
    try {
        if (!token) {
            return new Error("User not authenticated");
        }

        const res = await fetch(`${API_URL}/students/get-by-school`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to save files in DB");

        return { success: true, data: data.data };

    } catch (error) {
        console.log("Error geting students by school: ", error);
        return { success: false, error: error.message };
    }
}
