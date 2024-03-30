import { createContext } from "vm";
import { Basket } from "../models/Basket";
import { useContext } from "react";

interface StoreContextValue{
     basket: Basket | null;
     setBasket: (basket: Basket) => void;
     removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext();

export function useStoreContext() {
   // const context = useContext();   
}