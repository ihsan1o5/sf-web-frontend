import { API_URL, CLOUDINARY_UPLOAD_URL } from "constants/api";

export const uploadFilesToCloudinary = async (file, folder="school-fee-data", token) => {
    try {
        if (!token) {
            return new Error("User not authenticated");
        }

        // 1. Get Cloudinary signature from backend
        const signatureRes = await fetch(
            `${API_URL}/upload/cloudinary-signature?folder=${folder}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const signatureData = await signatureRes.json();

        if (!signatureData.success) {
            throw new Error("Failed to get Cloudinary Signature!");
        }

        const { timestamp, signature, apiKey, cloudName } = signatureData.data;


        const formData = new FormData();
        formData.append("file", file);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", apiKey);
        formData.append("folder", folder);

        const cloudinaryUploadUrl = `${CLOUDINARY_UPLOAD_URL}/${cloudName}/auto/upload`;

        const uploadRes = await fetch(cloudinaryUploadUrl, {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadRes.json();

        return { success: true, files: {
            name: file.name,
            url: uploadData.secure_url,
            public_id: uploadData.public_id,
            size: file.size,
            format: uploadData.format,
        }};

    } catch (error) {
        console.log("Cloudinary Upload Error: ", error);
        return { success: false, error: error.message };
    }
}

export const saveUploadedFilesToDB = async (uploadedFiles, token) => {
    try {
        if (!token) throw new Error("User not authenticated");
        if (!Array.isArray(uploadedFiles) || uploadedFiles.length === 0)
            throw new Error("No files to save");

        const res = await fetch(`${API_URL}/upload/files`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(uploadedFiles)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to save files in DB");

        return { success: true, data: data.data };
    } catch (error) {
        console.error("Save files to DB error:", error);
        return { success: false, error: error.message };
    }
}

export const getFilesForCurrentUser = async (token, page = 1, limit = 20) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/files/?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch files");

        return {
            success: true,
            count: data.count,
            data: data.data,
            pagination: data.pagination,
        };
    } catch (error) {
        console.log("Error getting files:", error);
        return { success: false, error: error.message };
    }
}

export const revertFileAndClearData = async (token, fileId) => {
    try {
        if (!token) return new Error("User not authenticated");

        const res = await fetch(`${API_URL}/files/${fileId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to delete file");

        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.log("Error deleting file:", error);
        return { success: false, error: error.message };
    }
}
