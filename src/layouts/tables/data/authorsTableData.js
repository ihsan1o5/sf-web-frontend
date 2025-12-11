import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data(stdData = [], handleOpenUpdate, handleDelete) {
  const Author = ({ image, name, remarks }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{remarks}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "student", accessor: "student", width: "45%", align: "left" },
      { Header: "father", accessor: "father", align: "left" },
      { Header: "fee", accessor: "fee", align: "center" },
      { Header: "for month", accessor: "month", align: "left" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],

    rows: stdData.map((std) => ({
      student: (
        <Author
          image={std.profileImage}
          name={std.name}
          remarks={std.remarks || "N/A"}
        />
      ),

      father: (
        <Job title={std.parent?.name || "No-Name"} description={std.parent?.cnic || "1560495003433"} />
      ),

      fee: (
        <MDBox ml={-1}>
          <MDTypography fontSize="12px" fontWeight="bold">
            Rs. {Number(std.fee?.$numberDecimal || 0).toLocaleString()}
          </MDTypography>
        </MDBox>
      ),

      month: (
        <MDTypography variant="caption" color="text" fontWeight="medium" textAlign="right">
          {std.forMonth}
        </MDTypography>
      ),

      actions: (
        <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
          {/* Edit Button */}
          <IconButton onClick={() => handleOpenUpdate(std)}>
            <EditIcon fontSize="small" />
          </IconButton>

          {/* Slash separator */}
          <MDTypography variant="caption" fontWeight="bold">
            /
          </MDTypography>

          {/* Delete Button (idle) */}
          <IconButton onClick={() => handleDelete(std._id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </MDBox>
      ),
    })),
  };
}