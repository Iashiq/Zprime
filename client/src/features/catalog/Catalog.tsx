 import ProductList from "./ProductList";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelector } from "./catalogSlice";



export default function Catalog(){
  const products = useAppSelector(productSelector.selectAll); 
  const {productsLoaded} = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    if(!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded])

    return(
    <>
      <ProductList products={products}/>
    </>
       
    )
}