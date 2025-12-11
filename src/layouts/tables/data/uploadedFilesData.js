import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data(filesData = []) {
  const Author = ({ image, name, createdAt }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{createdAt}</MDTypography>
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
          image={file.icon}
          name={file.name}
          createdAt={file.createdAt || "N/A"}
        />
      ),

      actions: (
        <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
          {/* Edit Button */}
          <IconButton>
            <EditIcon fontSize="small" />
          </IconButton>

          {/* Slash separator */}
          <MDTypography variant="caption" fontWeight="bold">
            /
          </MDTypography>

          {/* Delete Button (idle) */}
          <IconButton>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </MDBox>
      ),
    })),
  };
}