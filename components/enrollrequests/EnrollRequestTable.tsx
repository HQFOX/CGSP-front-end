import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export const EnrollRequestTable = ({requests}: {requests?: EnrollRequest[]}) => {

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Telephone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Project Id</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests?.map((row) => (
                <TableRow
                  key={row.firstName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.firstName}
                  </TableCell>
                  <TableCell >{row.lastName}</TableCell>
                  <TableCell >{row.telephoneNumber}</TableCell>
                  <TableCell >{row.email}</TableCell>
                  <TableCell >{row.projectId}</TableCell>
                  <TableCell >{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    )
}