
import { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

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
import { getStudentsBySchool } from "actions/student.actions";


function Dashboard() {
    const { columns, rows } = authorsTableData();
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState("card");
    const [students, setStudents] = useState([]);
    const { token } = useAuthStore();

    const handleSetTabValue = (event, newValue) => setTabValue(newValue);

    useEffect(() => {
      const fetchStudents = async () => {
        if (token) {
          const result = await getStudentsBySchool(token);
    
          if (result.success) {
            setStudents(result.data);
          } else {
            console.log("Error fetching students:", result.error);
          }
        }
      };
    
      fetchStudents();
    }, [token]);    

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

        <Grid container spacing={3} alignItems="center" mt={1}>
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
            <Grid container spacing={3} mt={1}>
              {students.map((std) => (
                <Grid item xs={12} md={6} xl={3} key={std._id}>
                  <DefaultInfoCard
                    profile={
                      std.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(std.name)}`
                    }
                    title={std.name}
                    description={`School fee due for the month of ${std.forMonth}`}
                    value={`Rs. ${Number(std.fee?.$numberDecimal || 0).toLocaleString()}`}
                  />
                </Grid>
              ))}
            </Grid>
        )}

        {tabValue === "table" && (
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
                                Authors Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                                />
                            </MDBox>
                        </Card>
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
