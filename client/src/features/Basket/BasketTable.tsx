import { Remove, Add, Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, IconButton } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { BasketItem } from "../../app/models/Basket";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";


interface Props{
    items: BasketItem[];
    isBasket?: boolean;
}
export default function BasketTable({items, isBasket = true}: Props) {
    const {basket} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return ( 
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} >
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              {isBasket &&
              <TableCell align="right"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display='flex' alignItems='center'>
                    <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}}/>
                    <span>
                        {item.name}
                    </span>
                  </Box>
                </TableCell>
                <TableCell align="center">${(item.price/100).toFixed(2)}</TableCell>
                <TableCell align="center">
                    {isBasket &&
                    <IconButton 
                      //loading={status === 'pendingRemoveItem'+ item.productId + 'rem'}
                      onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity : 1, name: 'rem'}))} color="error">
                        <Remove />
                    </IconButton>}
                    {item.quantity}
                    {isBasket &&
                    <IconButton 
                      //loading={status === 'pendingAddItem'+ item.productId} 
                      onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))} color="secondary">
                        <Add />
                    </IconButton>}
                </TableCell>
                <TableCell align="right">${((item.price)/100 * item.quantity).toFixed(2)}</TableCell>
                    {isBasket &&
                        <TableCell align="right">
                            <IconButton
                                //loading={status === 'pendingRemoveItem'+ item.productId + 'del'}
                                onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                color="error">
                                <Delete />
                            </IconButton>
                        </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}