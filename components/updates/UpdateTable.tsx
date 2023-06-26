import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export const UpdateTable = ({updates}: {updates?: Update[]}) => {

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Update Title</TableCell>
                <TableCell align="right">Content</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updates?.map((row) => (
                <TableRow
                  key={row.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    )
}