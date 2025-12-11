import React from 'react'

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Footer from 'examples/Footer'

import MDBox from 'components/MDBox'
import { Grid, Card } from '@mui/material'
import MDTypography from 'components/MDTypography'

import DataTable from 'examples/Tables/DataTable'
import uploadedFilesData from '../tables/data/uploadedFilesData';

function ManageFiles() {

    const { columns, rows } = uploadedFilesData([]);

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <div>ManageFiles</div>

        <MDBox pt={7} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <MDBox
                            mx={2}
                            mt={-3}
                            py={3}
                            px={2}
                            variant="gradient"
                            bgColor="info"
                            borderRadius="lg"
                            coloredShadow="info"
                        >
                            <MDTypography variant="h6" color="white">
                                My Uploaded Files
                            </MDTypography>
                        </MDBox>
                        <MDBox pt={3}>
                            <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                                
                            />
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </MDBox>

        <Footer />
    </DashboardLayout>
  )
}

export default ManageFiles