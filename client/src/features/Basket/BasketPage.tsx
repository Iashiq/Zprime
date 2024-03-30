import { useEffect, useState } from "react"
import { Basket } from "../../app/models/Basket"
import agent from "../../app/api/agent";
import { error } from "console";
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import BasketSummary from "./BasketSummary";

export default function BasketPage(){
    const [loading, setLoading] = useState(true);
    const [basket, setBasket] = useState<Basket | null>(null);
    //const [removeItem, setRemoveItem] = useState<{ productId: number; quantity: number }>(null);

    useEffect(() =>{
        agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error =>  console.log(error))
        .finally(() => setLoading(false))
    }, [])

    function removeItem(productId: number, quantity: number){
      if(!basket) return;
      const items = [...basket.items];
      const itemIndex = items.findIndex(i => i.productId===productId);
      if(itemIndex >=0){
        items[itemIndex].quantity -= quantity;
        if(items[itemIndex].quantity===0) items.splice(itemIndex,1);
        setBasket(prevState => {
          return {...prevState!, items}
        })
      }
    }

    function handleAddItem(productId: number){
        setLoading(true);
        agent.Basket.addItem(productId)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }

    function handleRemoveItem(productId: number, quantity = 1){
        setLoading(true);
        agent.Basket.removeItem(productId, quantity)
        .then(() => removeItem(productId, quantity))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }

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
                    <IconButton onClick={() => handleRemoveItem(item.productId)} color="error">
                        <Remove />
                    </IconButton>
                    {item.quantity}
                    <IconButton onClick={() => handleAddItem(item.productId)} color="secondary">
                        <Add />
                    </IconButton>
                </TableCell>
                <TableCell align="right">${((item.price)/100 * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => handleRemoveItem(item.productId, item.quantity)} color="error">
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