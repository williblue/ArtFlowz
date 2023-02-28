import { FC } from "react"
import styled from "styled-components"

type Props = {
  data: any
  select: any
  handleButtonClick: () => void
}

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 1000px;
`

const TableHead = styled.thead`
  background-color: #7539d4;
  color: white;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
`

const Button = styled.button`
  background-color: #7539d4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`

const CommissionTable: FC<Props> = ({ data, select, handleButtonClick }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Request ID</TableCell>
          <TableCell>Offer Amount (USDC)</TableCell>
          <TableCell>Creator</TableCell>
          <TableCell>Genre</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <tbody>
        {data?.map((item: any) => (
          <TableRow key={item.commissionID}>
            <TableCell>{item.commissionID}</TableCell>
            <TableCell>
              {parseFloat(item.commissionAmount).toFixed(2)}
            </TableCell>
            <TableCell>{item.creatorAddress}</TableCell>
            <TableCell>{item.genre}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  select(item)
                  handleButtonClick()
                }}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  )
}

export default CommissionTable
