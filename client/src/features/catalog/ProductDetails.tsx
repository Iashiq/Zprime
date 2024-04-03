import { Button, Divider, Grid, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product"; 
import agent from "../../app/api/agent";
import { currencyFormat } from "../../app/util/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {addBasketItemAsync, removeBasketItemAsync, setBasket } from "../Basket/basketSlice";


export default function ProductDetails(){

const {id} = useParams<{id: string}>();
const [product, setProduct] = useState<Product | null>(null); 
const [loading, setLoading] = useState(true);
const [quantity, setQuantity] = useState(0);
const {basket, status} = useAppSelector(state => state.basket);
const dispatch = useAppDispatch();
 
const item = basket?.items.find(i => i.productId===product?.id);

useEffect(() =>{
    if (!quantity && item) {
        setQuantity(item.quantity);
    }
   agent.Catalog.details(parseInt(id))
    .then(respose => setProduct(respose))
    .catch(error => console.log(error ))
    .finally(() => setLoading(false))
}, [id, item, quantity])



function handleInputChange(event: any){
    const value = parseInt(event.target.value);
    if(!isNaN(value) && value > 0)
    {
        setQuantity(value);
    } 
}

function handleUpdateCart(){
    if(!item || quantity > item.quantity){
        const updateQuantity = item ? quantity - item.quantity : quantity;
        dispatch(addBasketItemAsync({productId: product?.id, quantity: updateQuantity}))
    }
    else{
        const updateQuantity = item.quantity - quantity;
        dispatch(removeBasketItemAsync({productId: product?.id, quantity: updateQuantity}))
    }
}

if(loading) return <h3>Loading...</h3>

if(!product) return <h3>Product not found</h3>
    return(
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}}  />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant="h4" color='secondary'>{currencyFormat(product.price)}</Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{product.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>{product.description }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>{product.type}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Brand</TableCell>
                            <TableCell>{product.brand}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                           onChange={handleInputChange}
                           variant="outlined"
                           type="number"
                           label="Quantity in Cart"
                           fullWidth
                           value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                           disabled={item?.quantity===quantity}
                           //loading={status.includes('pendingRemoveItem' + item.productId)}
                           onClick={handleUpdateCart}
                           sx={{height: '55px'}} 
                           color='primary'
                           size='large'
                           variant='contained'
                           fullWidth
                        >
                            {item ? "Update Quantity" : "Add to Cart"}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
} 