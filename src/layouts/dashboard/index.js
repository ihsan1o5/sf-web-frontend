
import { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import UpdateStudentModal from "components/UpdateStudentModal/UpdateStudentModal";
import CustomPopupAlert from "components/CustomPopupAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import useToast from "hooks/useToast";

import authorsTableData from "layouts/tables/data/authorsTableData";
import { useAuthStore } from "store/authStore";
import { useUploadFileStore } from "store/uploadFileStore";
import { getStudentsBySchool, searchStudent, deleteStudent, getCounts } from "actions/student.actions";


function Dashboard() {
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState("card");
    const { token } = useAuthStore();
    const refreshKey = useUploadFileStore(state => state.refreshKey);
    const triggerRefresh = useUploadFileStore(s => s.triggerRefresh);
    const { showToast, ToastComponent } = useToast();
    
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const [searchHasMore, setSearchHasMore] = useState(true);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [counts, setCounts] = useState({
        pendingPayment: 0,
        totalPaid: 0,
        totalAmount: 0,
        totalStudents: 0,
    });
    
    const [countsLoading, setCountsLoading] = useState(false);

    const handleOpenUpdate = (student) => {
        setSelectedStudent(student);
        setOpenUpdateModal(true);
    };

    const handleCloseUpdate = () => {
        setSelectedStudent(null);
        setOpenUpdateModal(false);
        setOpenDeleteModal(false);
    };

    const handleDelete = (student) => {
        setSelectedStudent(student);
        setOpenDeleteModal(true);
    }

    const handleSubmitDelete = async () => {
        const result = await deleteStudent(
            token, 
            selectedStudent
        );

        if (result.success) {
            triggerRefresh();
            setOpenDeleteModal(false);
            showToast({
                color: "success",
                icon: "check",
                title: "Delete Success!",
                content: "Student record has been deleted successfully."
            });
        } else {
            showToast({
                color: "error",
                icon: "warning",
                title: "Delete Failed",
                content: "Something went wrong while deleting the record. Please try again latter."
            });
        }
    };
    
    const { columns, rows } = authorsTableData(students, handleOpenUpdate, handleDelete);

    const handleSetTabValue = (event, newValue) => setTabValue(newValue);

    useEffect(() => {
        if (isSearching) return;

        const loadStudents = async () => {
            if (!token || isLoading || !hasMore) return;

            setIsLoading(true);

            const result = await getStudentsBySchool(token, page, 20);

            if (result.success) {
                setStudents(prev => [...prev, ...result.data]);

                if (result.pagination.page >= result.pagination.totalPages) {
                    setHasMore(false);
                }
            } else {
                console.log("Error fetching students:", result.error);
            }

            setIsLoading(false);
        };

        loadStudents();
    }, [token, page, isSearching, refreshKey]);

    useEffect(() => {
        const trigger = document.getElementById("loadMoreTrigger");
        if (!trigger) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isLoading) {
                    if (isSearching && searchHasMore) {
                        setSearchPage(prev => prev + 1);
                    } else if (!isSearching && hasMore) {
                        setPage(prev => prev + 1);
                    }
                }
            },
            { threshold: 1 }
        );

        observer.observe(trigger);
        return () => observer.disconnect();
    }, [isSearching, hasMore, searchHasMore, isLoading]);

    useEffect(() => {
        if (!isSearching) return;

        const loadSearchResults = async () => {
            if (!token || isLoading || !searchHasMore) return;

            setIsLoading(true);

            const result = await searchStudent(token, searchQuery, searchPage, 20);

            if (result.success) {
                setStudents(prev => [...prev, ...result.data]);

                if (result.pagination.page >= result.pagination.totalPages) {
                    setSearchHasMore(false);
                }
            }

            setIsLoading(false);
        };

        loadSearchResults();
    }, [token, searchPage, isSearching]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.trim() === "") {
                // Exit search mode → Reset
                setIsSearching(false);
                setStudents([]);
                setPage(1);
                setHasMore(true);
            } else {
                // Enter search mode
                setIsSearching(true);
                setStudents([]);
                setSearchPage(1);
                setSearchHasMore(true);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delay);
    }, [searchQuery]);

    useEffect(() => {
        console.log("🔥 Refresh triggered — resetting student list...");
    
        setStudents([]);
        setPage(1);
        setHasMore(true);
        setIsSearching(false);
    
        // optional: scroll to top
        // window.scrollTo({ top: 0, behavior: "smooth" });
    }, [refreshKey]);

    useEffect(() => {
        if (!token) return;
      
        const loadCounts = async () => {
          setIsLoading(true);
      
          const result = await getCounts(token);
      
          if (result.success) {
            setCounts(result.data);
          } else {
            console.error("Failed to fetch counts:", result.error);
          }
      
          setIsLoading(false);
        };
      
        loadCounts();
    }, [token, refreshKey]);      

    console.log("all students data ====>>> ", students);
    console.log("counts ==================>>>>> ", counts);

  return (
    <DashboardLayout>
        {ToastComponent}
        <UpdateStudentModal
            open={openUpdateModal}
            onClose={handleCloseUpdate}
            student={selectedStudent}
        />

        <CustomPopupAlert
            open={openDeleteModal}
            onClose={handleCloseUpdate}
            handleSubmit={handleSubmitDelete}
        />
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="payment"
                title="Pending Payment"
                count={counts.pendingPayment}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total amount to be paid",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="paid"
                title="Total Paid"
                count={counts.totalPaid}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total pending amount",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="money"
                title="Total Amount"
                count={counts.totalAmount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Sum of pending plus paid amount",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Total Students"
                count={counts.totalStudents}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total registered students",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <Grid container alignItems="center" mt={1}>
            <Grid item xs={12} md={6} lg={7}>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                <AppBar position="static">
                    <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                        <Tab
                            label="Card View"
                            value="card"
                            icon={
                                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                    view_module
                                </Icon>
                            }
                        />
                        <Tab
                            label="Table View"
                            value="table"
                            icon={
                                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                    table_chart
                                </Icon>
                            }
                        />
                    </Tabs>
                </AppBar>
            </Grid>
        </Grid>

        {tabValue === "card" && (
            <>
                <Grid container spacing={3} mt={1}>
                {students.map((std) => (
                    <Grid item xs={12} md={6} xl={3} key={std._id}>
                        <DefaultInfoCard
                            profile={
                                std.profileImage ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(std.name)}`
                            }
                            title={std.name}
                            description={std.remarks}
                            value={`Rs. ${Number(std.fee?.$numberDecimal || 0).toLocaleString()}`}
                            fatherName={std.parent?.name}
                            fatherCnic={std.parent?.cnic}
                            onUpdate={() => handleOpenUpdate(std)}
                            onDelete={() => handleDelete(std._id)}
                        />
                    </Grid>
                ))}
                </Grid>

                {/* Infinite scroll trigger */}
                <div id="loadMoreTrigger" style={{ height: "40px" }} />

                {isLoading && (
                    <MDBox textAlign="center">
                        <CircularProgress color="success" />
                    </MDBox>
                )}
            </>
        )}

        {tabValue === "table" && students.length > 0 && (
            <MDBox pt={7} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
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
                                    Students Table
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
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        )}

        {students.length === 0 && !isLoading && (
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

      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
