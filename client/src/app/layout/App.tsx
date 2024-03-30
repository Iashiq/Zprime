 import { Container, CssBaseline} from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import  'react-toastify/dist/ReactToastify.css'; 
import { useEffect, useState } from "react";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import { error } from "console";


function App() {



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
