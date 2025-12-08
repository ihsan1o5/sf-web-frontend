import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import { useAuthStore } from "store/authStore";
import useToast from "hooks/useToast";

function Cover() {
  const register = useAuthStore((state) => state.register);

  const { showToast, ToastComponent } = useToast();

  const [form, setForm] = useState({
    name: "",
    cnic: "",
    email: "",
    password: "",
    agree: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = () => {
    setForm({ ...form, agree: !form.agree });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.cnic || !form.email || !form.password) {
      return showToast({
        color: "error",
        icon: "warning",
        title: "Missing Fields",
        content: "Please fill all required fields.",
      });
    }

    if (!form.agree) {
      return showToast({
        color: "warning",
        icon: "info",
        title: "Terms",
        content: "You must agree to the terms and conditions.",
      });
    }

    const res = await register(form.name, form.email, form.cnic, form.password);

    if (!res.success) {
      return showToast({
        color: "error",
        icon: "warning",
        title: "Registration Failed",
        content: res.error || "An error occurred.",
      });
    }

    showToast({
      color: "success",
      icon: "check",
      title: "Registration Successful",
      content: "Your account has been created!",
    });
  };

  return (
    <>
      {ToastComponent}

      <CoverLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Join us today
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your below details to register
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleRegister}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Name"
                  name="name"
                  variant="standard"
                  fullWidth
                  value={form.name}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="CNIC (Without '-' dashes)"
                  name="cnic"
                  variant="standard"
                  fullWidth
                  value={form.cnic}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  variant="standard"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  name="password"
                  variant="standard"
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox checked={form.agree} onChange={handleCheckbox} />
                <MDTypography variant="button" color="text" sx={{ cursor: "pointer" }}>
                  &nbsp;&nbsp;I agree to the&nbsp;
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDBox>

              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  Sign Up
                </MDButton>
              </MDBox>

              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-in"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </>
  );
}

export default Cover;
