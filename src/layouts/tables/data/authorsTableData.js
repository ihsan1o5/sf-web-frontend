import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function data(stdData=[]) {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
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
    //   { Header: "action", accessor: "action", align: "center" },
    ],

    rows: stdData.map((std) => ({
        student: (
            <Author
                image={std.profileImage}
                name={std.name}
                email={std.school?.email || "N/A"}
            />
        ),

        father: (
            <Job
                title={std.parent?.name || "No-Name"}
                description={std.parent?.cnic || "1560495003433"}
            />
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
    })),
  };
}
