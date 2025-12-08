import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Zustand Auth Store
import { useAuthStore } from "store/authStore"; 
import useToast from "hooks/useToast";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Image
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  
  // ✅ Correct toast usage (same as register)
  const { showToast, ToastComponent } = useToast();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      return showToast({
        color: "error",
        icon: "warning",
        title: "Missing Fields",
        content: "Please fill in all fields.",
      });
    }

    const result = await login(email, password);

    if (!result.success) {
      return showToast({
        color: "error",
        icon: "warning",
        title: "Login Failed",
        content: result.error || "Invalid email or password.",
      });
    }

    showToast({
      color: "success",
      icon: "check",
      title: "Login Successful",
      content: "Redirecting...",
    });

    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <>
      {/* ✅ Add toast component exactly like signup */}
      {ToastComponent}

      <BasicLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign In
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to sign in
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleLogin}>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </MDBox>

              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>

              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </MDButton>
              </MDBox>

              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign Up
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayout>
    </>
  );
}

export default Basic;
