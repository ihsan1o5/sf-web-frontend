import {
  Modal,
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { updateStudent } from "actions/student.actions";
import { useUploadFileStore } from "store/uploadFileStore";
import { useAuthStore } from "store/authStore";
import useToast from "hooks/useToast";

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

export default function UpdateStudentModal({ open, onClose, student }) {
  const { token } = useAuthStore();
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [className, setClassName] = useState("");
  const [fee, setFee] = useState(0.0);
  const [forMonth, setForMonth] = useState("");
  const [remarks, setRemarks] = useState("");

  const triggerRefresh = useUploadFileStore(s => s.triggerRefresh);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (student) {
      setName(student.name || "");
      setRegistrationNumber(student.registrationNumber || "");
      setClassName(student.class || "");
      setFee(student.fee?.$numberDecimal || 0.0);
      setForMonth(student.forMonth || 0.0);
      setRemarks(student.remarks || "");
    }
  }, [student]);

  const handleSubmit = async () => {
    const result = await updateStudent(
        token, 
        {
            name,
            registrationNumber,
            class: className,
            fee,
            forMonth,
            remarks
        },
        student._id
    );
    console.log("update student resutl ============>>>>>>>>> ", result);

    if (result.success) {
      triggerRefresh(); // refresh list
      onClose();
      showToast({
        color: "success",
        icon: "check",
        title: "Update Success!",
        content: "Student record has been updated successfully."
      });
    } else {
      showToast({
        color: "error",
        icon: "warning",
        title: "Update Failed",
        content: "Something went wrong while updating the record. Please try again latter."
      });
    }
    // console.log("submitting update form =============>>>>>>>> ", student);
  };

  return (
    <>
        {ToastComponent}
        <Modal open={open} onClose={onClose}>
        <Box sx={style}>
            <Typography variant="h6">Update Student</Typography>

            <TextField
            fullWidth
            margin="normal"
            label="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <TextField
            fullWidth
            margin="normal"
            label="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            />

            <TextField
            fullWidth
            margin="normal"
            label="Class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            />

            <TextField
            type="number"
            fullWidth
            margin="normal"
            label="Fee"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            />

            <TextField
            fullWidth
            margin="normal"
            label="For Month"
            value={forMonth}
            onChange={(e) => setForMonth(e.target.value)}
            />

            <TextField
            fullWidth
            margin="normal"
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            />

            <Box mt={2} textAlign="right">
            <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} color="white">Update</Button>
            </Box>
        </Box>
        </Modal>
    </>
  );
}