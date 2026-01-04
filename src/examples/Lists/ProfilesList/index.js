// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { IconButton } from "@mui/material";
import AddAccountModal from "components/AddAccountModal/AddAccountModal";
import CustomPopupAlert from "components/CustomPopupAlert";

import { deleteBankAccount } from "actions/account.actions";
import { useAuthStore } from "store/authStore";
import { useProfileStore } from "store/profileStore";
import useToast from "hooks/useToast";

import bankImage from "assets/images/bank2.png";

function ProfilesList({ title, accounts, shadow }) {
  const { token } = useAuthStore();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const triggerRefresh = useProfileStore(s => s.triggerRefresh);
  const { showToast, ToastComponent } = useToast();

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setAccountToEdit(null);
  }

  const handleEditModalOpen = (account) => {
    setAccountToEdit(account);
    setOpenEditModal(true);
  }

  const handleDeleteAccountOpen = (accountId) => {
    setAccountToDelete(accountId);
    setOpenDeleteAlert(true);
  }

  const handleDeleteAccountSubmit = async () => {
    if (!accountToDelete) return;

    // Call delete action here
    const result = await deleteBankAccount(token, accountToDelete);
    
    if (result.success) {
        triggerRefresh(); // refresh list
        showToast({
            color: "success",
            icon: "check",
            title: "Delete Success!",
            content: "Account Deleted successfully."
        });
    } else {
        showToast({
            color: "error",
            icon: "warning",
            title: "Delete Failed",
            content: "Something went wrong while deleting account. Please try again latter." 
        });
    }

    setOpenDeleteAlert(false);
    setAccountToDelete(null);
  }

  const renderProfiles = accounts.map(({ _id, accountTitle, accountNumber, bankName }) => (
    <MDBox key={accountNumber} component="li" display="flex" alignItems="center" py={1} mb={1}>
      <MDBox mr={2}>
        <MDAvatar src={bankImage} alt="something here" shadow="md" />
      </MDBox>
      <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        <MDTypography variant="button" fontWeight="medium">
          {accountTitle}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {accountNumber} ({bankName})
        </MDTypography>
      </MDBox>
      <MDBox ml="auto">
        <IconButton
          onClick={() => handleEditModalOpen({ _id, accountTitle, accountNumber, bankName }) }
        >
            <EditIcon />
        </IconButton>

        <IconButton
          onClick={() => handleDeleteAccountOpen(_id)}
        >
            <DeleteSweepIcon />
        </IconButton>
      </MDBox>
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      {ToastComponent}
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderProfiles}
        </MDBox>
      </MDBox>
      <AddAccountModal 
        open={openEditModal} 
        onClose={handleEditModalClose}
        account={accountToEdit}
        title="Edit Account"
      />

      <CustomPopupAlert
        open={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        handleSubmit={handleDeleteAccountSubmit}
      />
    </Card>
  );
}

// Setting default props for the ProfilesList
ProfilesList.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfilesList
ProfilesList.propTypes = {
  title: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  shadow: PropTypes.bool,
};

export default ProfilesList;
