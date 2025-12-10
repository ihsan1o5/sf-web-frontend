
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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

import authorsTableData from "layouts/tables/data/authorsTableData";
import { useAuthStore } from "store/authStore";
import { useUploadFileStore } from "store/uploadFileStore";
import { getStudentsBySchool, searchStudent } from "actions/student.actions";


function Dashboard() {
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState("card");
    const { token } = useAuthStore();
    const refreshKey = useUploadFileStore(state => state.refreshKey);
    
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const [searchHasMore, setSearchHasMore] = useState(true);
    
    const { columns, rows } = authorsTableData(students);

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

    console.log("all students data ====>>> ", students);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
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
