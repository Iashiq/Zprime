 import { Container, CssBaseline} from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import  'react-toastify/dist/ReactToastify.css'; 
import { fetchBasketAsync } from "../../features/Basket/basketSlice";
import { useAppDispatch } from "../store/configureStore";
import { useCallback, useEffect } from "react";
import { fetchCurrentUser } from "../../features/account/accountSlice";


function App() {

  const dispatch = useAppDispatch();

  const initApp =  useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
      
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp();
  }, [initApp])


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
