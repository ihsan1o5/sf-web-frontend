import {
  Modal,
  Box,
  Button,
  Typography
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import useToast from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import { useUploadFileStore } from "store/uploadFileStore";
import { deleteStudent } from "actions/student.actions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function CustomPopupAlert({ open, onClose, handleSubmit }) {

  return (
    <>
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <MDBox textAlign="center">
                    <Typography variant="h6">Are you sure! You want to delete this record?</Typography>
                    <ErrorOutlineIcon sx={{ width: 120, height: 120, margin: 5 }} color="error" />
                </MDBox>

                <Box mt={2} textAlign="right">
                    <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                    <MDButton
                        variant="gradient"
                        color="error"
                        fullWidth
                        sx={{ width: 'auto' }}
                        onClick={handleSubmit}
                    >
                        Yes, Delete
                    </MDButton>
                </Box>
            </Box>
        </Modal>
    </>
  );
}