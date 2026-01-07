import React, { useCallback, useState, useEffect } from 'react'
import MDBox from "components/MDBox";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {useDropzone} from 'react-dropzone'
import { uploadFilesToCloudinary } from 'actions/file.actions';
import { useAuthStore } from 'store/authStore';
import { useUploadFileStore } from 'store/uploadFileStore';

import { getFileType } from 'utils';
import Thumbnail from 'components/Thumbnail';
import { convertFileToUrl } from 'utils';
import { isValidFileType } from 'utils';

import useToast from 'hooks/useToast';
import { saveUploadedFilesToDB } from 'actions/file.actions';
import { getBankAccounts } from 'actions/account.actions';

function UploadFile() {
    const [files, setFiles] = useState([]);
    const { showToast, ToastComponent } = useToast();
    const { token } = useAuthStore();
    const triggerRefresh = useUploadFileStore(state => state.triggerRefresh);


    const onDrop = useCallback(async (acceptedFiles) => {
        const userBankAccounts = await getBankAccounts(token);
        console.log("account result ======>>>>>.. ", userBankAccounts);

        if (userBankAccounts.success && userBankAccounts.accounts.length === 0) {
            return showToast({
                color: "error",
                icon: "warning",
                title: "Bank Account Not Found",
                content: "It looks like you don't have any bank accounts added yet. Please add at least one bank account to proceed. Thank you!"
            });
        }

        setFiles(acceptedFiles);
        let uploadedList = [];
        let successfullyUploadedFiles = []; // track which files uploaded to cloudinary
    
        // Upload to Cloudinary
        for (const file of acceptedFiles) {
            const { extension } = getFileType(file.name);
            const isFileValid = isValidFileType(extension);
    
            if (!isFileValid) continue;
    
            try {
                const result = await uploadFilesToCloudinary(file, "school-fee-data", token);
    
                if (result.success) {
    
                    uploadedList.push({
                        name: result.files.name,
                        public_id: result.files.public_id,
                        url: result.files.url,
                    });
    
                    successfullyUploadedFiles.push(file.name);
    
                } else {
                    console.error("Upload failed for", file.name, result.error);
                    return showToast({
                        color: "error",
                        icon: "warning",
                        title: "Failed to upload file!",
                        content: `Error uploading ${file.name}: ${result.error}`,
                    });
                }
    
            } catch (err) {
                console.error("Upload error for", file.name, err);
            }
        }
    
        // Save to DB only after all uploads finish
        if (uploadedList.length > 0) {
            const saveRes = await saveUploadedFilesToDB(uploadedList, token);
    
            if (saveRes.success) {
                console.log("All uploaded files saved to DB:", saveRes.data);
    
                // 🟢 Remove only after DB save success
                setFiles(prev => prev.filter(f => !successfullyUploadedFiles.includes(f.name)));

                // 🔥 Trigger global refresh
                triggerRefresh();
    
                showToast({
                    color: "success",
                    icon: "check",
                    title: "Files saved successfully",
                    content: `${saveRes.data.length} files saved in DB`
                });
    
            } else {
                showToast({
                    color: "error",
                    icon: "warning",
                    title: "Failed to save files",
                    content: saveRes.error
                });
            }
        }
    });    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    // REMOVE INVALID FILES ONE BY ONE
    useEffect(() => {
        if (files.length === 0) return;

        // find first invalid file
        const firstInvalid = files.find(file => {
            const { extension } = getFileType(file.name);
            return !isValidFileType(extension);
        });

        // If no invalid file found → do nothing
        if (!firstInvalid) return;

        // Remove only ONE invalid file after 1.5 sec
        const timer = setTimeout(() => {
            setFiles(prev =>
                prev.filter(f => f.name !== firstInvalid.name)
            );
        }, 1500);

        return () => clearTimeout(timer);
    }, [files]);

    const handleRemoveFile = (e, fileName) => {
        e.stopPropagation();
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    }
    return (
    <>
        {ToastComponent}
        <MDBox
            {...getRootProps()}
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={isDragActive ? "13rem" : "3.25rem"}
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius={isDragActive ? "5%" : "50%"}
            position="fixed"
            right="2rem"
            bottom="6rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: "pointer" }}
            //   onClick={handleConfiguratorOpen}
        >
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <CloudUploadIcon fontSize="small">CloudUpload</CloudUploadIcon>
            }
            {files.length > 0 && <ul className="uploader-preview-list">
                <h4 className="h4 text-light-100">Uploading</h4>
                {files.map((file, index) => {
                    const { type, extension } = getFileType(file.name);
                    const isFileValid = isValidFileType(extension);

                    if (isFileValid) {
                        return (
                            <li key={`${file.name}-${index}`} className="uploader-preview-item">
                                <div className="flex items-center gap-3">
                                    <Thumbnail 
                                        type={type}
                                        extenstion={extension}
                                        url={convertFileToUrl(file)}
                                    />

                                    <div className="preview-item-name">
                                        {file.name}
                                        <img 
                                            src="/assets/icons/file-loader.gif"
                                            width={80}
                                            height={26}
                                            alt="file uploading"
                                        />
                                    </div>
                                </div>

                                <img 
                                    src="/assets/icons/remove.svg"
                                    width={24}
                                    height={24}
                                    alt="remove file"
                                    onClick={(e) => handleRemoveFile(e, file.name)}
                                    className="cursor-pointer"
                                />
                            </li>
                        );
                    }else{
                        return (
                            <li key={`${file.name}-${index}`} className="uploader-preview-item error-toast">
                                <div className="flex items-center gap-3">
                                    <Thumbnail 
                                        type={type}
                                        extenstion={extension}
                                        url={convertFileToUrl(file)}
                                    />

                                    <div className="preview-item-name">
                                        <p>
                                            File type not supported. Please upload only (csv, xlsx, xls) files.
                                        </p>
                                        <br />
                                        <img 
                                            src="/assets/icons/file-loader.gif"
                                            width={80}
                                            height={26}
                                            alt="file uploading"
                                        />
                                    </div>
                                </div>

                                <img 
                                    src="/assets/icons/remove.svg"
                                    width={24}
                                    height={24}
                                    alt="remove file"
                                    onClick={(e) => handleRemoveFile(e, file.name)}
                                    className="cursor-pointer"
                                />
                            </li>
                        );
                    }
                })}    
            </ul>}
        </MDBox>
    </>
    )
}

export default UploadFile