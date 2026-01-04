import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfilesList from "examples/Lists/ProfilesList";

// Overview page components
import Header from "layouts/profile/components/Header";

import { useAuthStore } from "store/authStore";
import { useProfileStore } from "store/profileStore";
import { getBankAccounts } from "actions/account.actions";

function Overview() {
  const { token } = useAuthStore();
  const refreshKey = useProfileStore((s) => s.refreshKey);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!token) return;
  
    const fetchAccounts = async () => {
      const result = await getBankAccounts(token);
      if (result.success) {
        setAccounts(result.accounts);
      }
    };
  
    fetchAccounts();
  }, [token, refreshKey]);  

  console.log("Accounts fetched: ", accounts);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} xl={12}>
              {accounts.length > 0 &&
                <ProfilesList title="My Accounts" accounts={accounts} shadow={false} />
              }
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
