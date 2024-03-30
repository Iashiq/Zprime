import { Button, Divider, Grid, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product"; 
import agent from "../../app/api/agent";
import { currencyFormat, getCookie } from "../../app/util/util";
import { Basket } from "../../app/models/Basket";
import { error } from "console";
export default function ProductDetails()
{

const {id} = useParams<{id: string}>();
const [product, setProduct] = useState<Product | null>(null); 
const [loading, setLoading] = useState(true);
const [quantity, setQuantity] = useState(0);
const [submitting, setSubmitting] = useState(false);
const [basket, setBasket] = useState<Basket>();
const buyerId = getCookie('buyerId');

    if(buyerId)
    {
        agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
    }
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

function handleInputChange(event: any){
    const value = parseInt(event.target.value);
    if(!isNaN(value) && value > 0)
    {
        setQuantity(value);
    } 
}

function handleUpdateCart(){
    setSubmitting(true);
    if(!item || quantity > item.quantity){
        const updateQuantity = item ? quantity - item.quantity : quantity;
        agent.Basket.addItem(product?.id!, updateQuantity)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false));
    }
    else{
        const updateQuantity = item.quantity - quantity;
        agent.Basket.removeItem(product?.id!, updateQuantity)
        .then(() => removeItem(product?.id!, updateQuantity))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false)) ;
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