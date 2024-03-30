import { Grid } from "@mui/material";
import { Product } from "../../app/models/Product";
import ProductCard from "./ProcductCard";

interface Props{
    products: Product[];
}

export default function ProductList({products}: Props) {
    return(
        <Grid container spacing={5}>
          {products.map(product => (
            <Grid item xs={4} key={product.id}> 
                <ProductCard product={product}/>
            </Grid>
              
          ))}
      </Grid> 
    )
}