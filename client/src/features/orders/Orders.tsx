import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Order } from "../../app/models/order";
import axios from "axios";
import { currencyFormat } from "../../app/util/util";
import OrderDetail from "./OrderDetail";

export default function Orders() {

    const [Orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5223/api/Order')
            .then(response => setOrders(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [])


  if (selectedOrderNumber > 0) return (
    console.log('clicked'),
        <OrderDetail
            order={Orders?.find(o => o.id === selectedOrderNumber)!}
            setSelectedOrder={setSelectedOrderNumber}
        />
    )

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order number</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Order Date</TableCell>
              <TableCell align="right">Order Status</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Orders?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
                <TableCell align="right">{order.orderStatus}</TableCell>
                <TableCell align="right">
                    <Button onClick={() => setSelectedOrderNumber(order.id)}>
                        view
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}