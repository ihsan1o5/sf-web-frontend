import {
    Modal,
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { addBankAccount, updateBankAccount } from "actions/account.actions";
import { useProfileStore } from "store/profileStore";
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
  
  export default function UpdateStudentModal({ open, onClose, account=null, title="Add New Account" }) {
    const { token } = useAuthStore();
    const [bankName, setBankName] = useState("");
    const [accountTitle, setAccountTitle] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
  
    const triggerRefresh = useProfileStore(s => s.triggerRefresh);
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        if (!open) return; // important
      
        if (account) {
          setBankName(account.bankName || "");
          setAccountTitle(account.accountTitle || "");
          setAccountNumber(account.accountNumber || "");
        } else {
          setBankName("");
          setAccountTitle("");
          setAccountNumber("");
        }
    }, [account, open]);      
  
    const handleSubmit = async () => {
        if (!bankName || !accountTitle || !accountNumber) {
            showToast({
                color: "warning",
                icon: "warning",
                title: "Validation Error",
                content: "Please fill in all required fields."
            });
            return;
        }
        console.log("Submitting new account =======>>>> ");

        let result = null;
        if (!account) {
            result = await addBankAccount(
                token, 
                {
                    accountTitle,
                    accountNumber,
                    bankName
                }
            );
        }else{
            result = await updateBankAccount(
                token,
                account._id,
                {
                    accountTitle,
                    accountNumber,
                    bankName 
                }
            );
        }
        console.log("add account result ============>>>>>>>>> ", result);
    
        if (result.success) {
            triggerRefresh(); // refresh list
            onClose();
            showToast({
                color: "success",
                icon: "check",
                title: account === null ? "Create Success!" : "Update Success!",
                content: account === null ? "New Account Added successfully." : "Account updated successfully."
            });
        } else {
            showToast({
                color: "error",
                icon: "warning",
                title: account === null ? "Create Failed" : "Update Failed",
                content: account === null ? 
                            "Something went wrong while adding new account. Please try again latter." 
                            : "Something went wrong while updating the account. Please try again latter."
            });
        }
    };
  
    return (
      <>
          {ToastComponent}
          <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">{title}</Typography>
    
                <TextField
                    fullWidth
                    margin="normal"
                    label="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                />
    
                <TextField
                    fullWidth
                    margin="normal"
                    label="Account Title"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    required
                />
    
                <TextField
                    fullWidth
                    margin="normal"
                    label="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                />
    
    
                <Box mt={2} textAlign="right">
                    <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} color="white">
                        {account === null ? "Add Account" : "Update Account"}
                    </Button>
                </Box>
            </Box>
          </Modal>
      </>
    );
  }