 import { Container, CssBaseline} from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import  'react-toastify/dist/ReactToastify.css'; 
import { setBasket } from "../../features/Basket/basketSlice";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import { useAppDispatch } from "../store/configureStore";
import { useEffect } from "react";


function App() {

  const dispatch = useAppDispatch();

  useEffect(() =>{
    const buyerId = getCookie('buyerId');
    if(buyerId)
    {
        agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
    }
  
  }, [dispatch])


return(
   <>
      <ToastContainer position="bottom-right" hideProgressBar theme="color"/>
      <CssBaseline />
      <Header/>
      <Container>
        <Outlet/>
      </Container>
    </>
  );
}

export default App;
