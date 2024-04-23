import { Button, Grid, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { useAppSelector } from "../../app/store/configureStore";
 import { Link } from "react-router-dom";
import BasketTable from "./BasketTable";

export default function BasketPage(){
   
    const {basket} = useAppSelector(state => state.basket);

    

    //if(loading) return <Typography variant="h3">Your basket is empty</Typography> 
    if (!basket || !basket.items || basket.items.length === 0) return <Typography variant="h3">Your basket is empty</Typography>; // Handle case where basket is null or empty

    return(
      <>
      <BasketTable items={basket.items}/>
      <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6}>
            <BasketSummary /> 
            <Button
              component={Link}
              to='/checkout'
              variant='contained'
              size="large"  
              fullWidth
            >
              Proceed to checkout
            </Button>
        </Grid>

      </Grid>
      </>
        
    )
}