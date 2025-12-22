import React, { useState, useEffect } from 'react'

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Footer from 'examples/Footer'

import MDBox from 'components/MDBox'
import CircularProgress from '@mui/material/CircularProgress';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { Grid, Card } from '@mui/material'
import MDTypography from 'components/MDTypography'
import CustomPopupAlert from 'components/CustomPopupAlert'


import DataTable from 'examples/Tables/DataTable'
import uploadedFilesData from '../tables/data/uploadedFilesData';
import useToast from 'hooks/useToast'

import { useAuthStore } from 'store/authStore';
import { useUploadFileStore } from 'store/uploadFileStore'
import { getFilesForCurrentUser, revertFileAndClearData } from 'actions/file.actions'


function ManageFiles() {
    const [files, setFiles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSeletedFile] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { token } = useAuthStore();
    const refreshKey = useUploadFileStore(state => state.refreshKey);
    const triggerRefresh = useUploadFileStore(s => s.triggerRefresh);
    const { showToast, ToastComponent } = useToast();

    const handleClosePopup = () => {
        setSeletedFile(null);
        setOpenDeleteModal(false);
    };

    const handleDelete = (fileId) => {
        setSeletedFile(fileId);
        setOpenDeleteModal(true);
    }

    const handleSubmitDelete = async () => {
        setOpenDeleteModal(false);
        setIsLoading(true);
      
        const result = await revertFileAndClearData(token, selectedFile);
      
        setIsLoading(false); // ✅ always boolean
      
        if (result.success) {
          triggerRefresh();
      
          showToast({
            color: "success",
            icon: "check",
            title: "Delete Success!",
            content: "File deleted successfully."
          });
        } else {
          showToast({
            color: "error",
            icon: "warning",
            title: "Delete Failed",
            content: result.message || "Something went wrong."
          });
        }
    };
      

    const { columns, rows } = uploadedFilesData(files, handleDelete);

    useEffect(() => {
        const loadFiles = async () => {
          if (!token) return;
      
          setIsLoading(true);
      
          const result = await getFilesForCurrentUser(token, page, 20);
      
          if (result.success) {
            setFiles(prev =>
              page === 1 ? result.data : [...prev, ...result.data]
            );
      
            if (result.pagination.page >= result.pagination.totalPages) {
              setHasMore(false);
            }
          }
      
          setIsLoading(false);
        };
      
        loadFiles();
    }, [token, page, refreshKey]); // ✅ IMPORTANT

    useEffect(() => {
        setFiles([]);
        setPage(1);
        setHasMore(true);
    }, [refreshKey]);      

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <CustomPopupAlert
            open={openDeleteModal}
            onClose={handleClosePopup}
            handleSubmit={handleSubmitDelete}
        />

        <MDBox pt={7} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        {files.length > 0 && !isLoading &&
                            <>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        My Uploaded Files
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                        pagination={{
                                            onEndReached: () => {
                                                if (!isLoading && hasMore) {
                                                    setPage(prev => prev + 1);   // load next API page
                                                }
                                            },
                                        }}
                                    />
                                </MDBox>
                            </>
                        }

                        {isLoading && (
                            <MDBox textAlign="center" sx={{ padding: 5 }}>
                                <CircularProgress color="success" />
                            </MDBox>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </MDBox>

        {files.length === 0 && !isLoading && (
            <MDBox pt={7} pb={3} textAlign="center">
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <FolderOffIcon sx={{ width: 120, height: 120, color: "grey.500" }} />
                        <MDTypography>
                            No Data Found!
                        </MDTypography>
                    </Grid>
                </Grid>
            </MDBox>
        )}

        <Footer />
    </DashboardLayout>
  )
}

export default ManageFiles;