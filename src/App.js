import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import CircularProgress from '@mui/material/CircularProgress';
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import routes from "routes";
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

import UploadFile from "components/UploadFile";

import { useAuthStore } from "store/authStore";

// ---------------------------
// 🔒 Protected Route Wrapper
// ---------------------------
function ProtectedRoute({ children }) {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;

  return user ? children : <Navigate to="/authentication/sign-in" replace />;
}

// ---------------------------
// 🚫 Public Auth Routes Wrapper
// If already logged in -> redirect to dashboard
// ---------------------------
function PublicRoute({ children }) {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;

  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const { pathname } = useLocation();
  const { checkAuth, user, isCheckingAuth } = useAuthStore(); // ⬅ get user from auth store

  // 🔐 Check authentication on first load
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, []);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) return getRoutes(route.collapse);

      if (route.route) {
        if (route.route.startsWith("/authentication")) {
          return (
            <Route
              key={route.key}
              path={route.route}
              element={<PublicRoute>{route.component}</PublicRoute>}
            />
          );
        }

        return (
          <Route
            key={route.key}
            path={route.route}
            element={<ProtectedRoute>{route.component}</ProtectedRoute>}
          />
        );
      }

      return null;
    });

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  useMemo(() => {
    setRtlCache(
      createCache({
        key: "rtl",
        stylisPlugins: [rtlPlugin],
      })
    );
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const configsButton = (
    <>
        <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="small">settings</Icon>
        </MDBox>
        <UploadFile />
    </>
  );

  if (isCheckingAuth) {
    // show a loader instead of null
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress color="success" /></div>;
  }
  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && user && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="OxiDigital"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        <Routes>
          {getRoutes(routes)}

          {/* Redirect '/' to '/dashboard' */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/authentication/sign-in" />} /> */}
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && user && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="OxiDigital"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      <Routes>
        {getRoutes(routes)}

        {/* Redirect '/' to '/dashboard' */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/authentication/sign-in" />} /> */}
      </Routes>
    </ThemeProvider>
  );
}
