import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/Basket";
import { currencyFormat, getCookie } from "../../app/util/util";

export default function BasketSummary() {
    const [basket, setBasket] = useState<Basket>();
    

    const buyerId = getCookie('buyerId');

    if(buyerId)
    {
        agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
    }

    const subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const deliveryFee = subtotal > 10000 ? 0 : 500;

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}