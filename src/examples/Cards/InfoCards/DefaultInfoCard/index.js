// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import burceMars from "assets/images/bruce-mars.jpg";

function DefaultInfoCard({ profile, title, description, value, fatherName="No-Name", fatherCnic="1560495003433" }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MDBox p={2} mx={3} display="flex" gap={2} justifyContent="start">
        <Grid item>
          <MDAvatar
            src={profile ? profile : burceMars}
            alt="profile-image"
            size="md"
            shadow="sm"
          />
        </Grid>

        <MDBox display="flex" flexDirection="column" justifyContent="start" mt={0.5}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>

          {description && (
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>

      <MDBox px={5}>
          <MDTypography variant="caption" color="text" fontWeight="regular" display="block">
            Father Name: <MDTypography display="inline" fontSize="12px" fontWeight="bold">{fatherName}</MDTypography>
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="regular" display="block" mt={0.5}>
            Father CNIC: <MDTypography display="inline" fontSize="12px" fontWeight="bold">{fatherCnic}</MDTypography>
          </MDTypography>
      </MDBox>

      {/* Push this section to the bottom for consistent height */}
      <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25} mt="auto">
        {description && !value ? null : <Divider />}

        {value && (
          <MDTypography variant="h5" fontWeight="medium">
            {value}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}


// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DefaultInfoCard;
