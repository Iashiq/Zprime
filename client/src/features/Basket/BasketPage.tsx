import { useState } from "react"
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import BasketSummary from "./BasketSummary";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

export default function BasketPage(){
   
    const {basket} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    

    //if(loading) return <Typography variant="h3">Your basket is empty</Typography> 
    if (!basket || !basket.items || basket.items.length === 0) return <Typography variant="h3">Your basket is empty</Typography>; // Handle case where basket is null or empty

    return(
      <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} >
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map(item => (
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
                    <IconButton 
                      //loading={status === 'pendingRemoveItem'+ item.productId + 'rem'}
                      onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity : 1, name: 'rem'}))} color="error">
                        <Remove />
                    </IconButton>
                    {item.quantity}
                    <IconButton 
                      //loading={status === 'pendingAddItem'+ item.productId} 
                      onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))} color="secondary">
                        <Add />
                    </IconButton>
                </TableCell>
                <TableCell align="right">${((item.price)/100 * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <IconButton 
                       //loading={status === 'pendingRemoveItem'+ item.productId + 'del'}
                       onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: item.quantity, name: 'del'}))} 
                      color="error">
                        <Delete /> 
                    </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6}>
          <BasketSummary /> 
        </Grid>

      </Grid>
      </>
        
    )
}