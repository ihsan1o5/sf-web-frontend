import * as React from 'react';
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MDAvatar from "components/MDAvatar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import burceMars from "assets/images/bruce-mars.jpg";

function DefaultInfoCard({ profile, title, description, value, fatherName="No-Name", fatherCnic="1560495003433", onUpdate, onDelete }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <MDBox 
            p={2} 
            mx={1} 
            display="flex" 
            gap={2} 
            justifyContent="start" 
            position="relative"
        >
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

            {/* Top-right icon button */}
            <IconButton 
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8, 
                    p: "5px" 
                }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                list: {
                    'aria-labelledby': 'basic-button',
                },
                }}
            >
                <MenuItem onClick={() => { handleClose(); onUpdate(); }}>
                    <EditIcon fontSize='small' />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <MDTypography fontSize="16px">
                        Update
                    </MDTypography>
                </MenuItem>
                <MenuItem onClick={() => {handleClose(); onDelete(); }}>
                    <DeleteIcon fontSize='small' />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <MDTypography fontSize="16px">
                        Delete
                    </MDTypography>
                </MenuItem>
            </Menu>
        </MDBox>

        <MDBox px={5}>
            <MDTypography variant="caption" color="text" fontWeight="regular" display="block">
            Father Name: <MDTypography display="inline" fontSize="12px" fontWeight="bold">{fatherName}</MDTypography>
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular" display="block" mt={0.5}>
            Father CNIC: <MDTypography display="inline" fontSize="12px" fontWeight="bold">{fatherCnic}</MDTypography>
            </MDTypography>
        </MDBox>

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
