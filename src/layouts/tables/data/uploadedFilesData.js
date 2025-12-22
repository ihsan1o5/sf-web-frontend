import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDButton from "components/MDButton";

import { getFileType } from "utils";
import Thumbnail from "components/Thumbnail";

const formatDateTime = (dateString, ) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function data(filesData = [], handleDelete) {
  const Author = ({ file, createdAt }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <Thumbnail
        type={getFileType(file.name).type}
        extenstion={getFileType(file.name).extension}
        url={file.url}   // ✅ FIXED
      />
  
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {file.name}
        </MDTypography>
        <MDTypography variant="caption">
          {formatDateTime(createdAt)}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "file", accessor: "file", width: "75%", align: "left" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],

    rows: filesData.map((file) => ({
      file: (
        <Author
          file={file}
          createdAt={file.createdAt || "N/A"}
        />
      ),

      actions: (
        <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
          <MDButton
              variant="gradient"
              color="error"
              fullWidth
              sx={{ width: 'auto' }}
              onClick={() => handleDelete(file._id)}
          >
              Revert This File
          </MDButton>
        </MDBox>
      ),
    })),
  };
}