import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import agent from "../api/agent";
import { getCookie } from "../util/util";
import { useAppSelector } from "../store/configureStore";
import { setBasket } from "../../features/Basket/basketSlice";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
]

const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
]

const navStyles = {
    color:'inherit',
    typography: 'h8',
    textDecoration: 'none',
    '&:hover': {
       color: 'grey.500'
    },
    '&.active':{
       color: 'text.secondary'
    }

}

export default function Header(){
   
    const {basket} = useAppSelector(state => state.basket);
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector(state => state.account);

    const buyerId = getCookie('buyerId');

    if(buyerId)
    {
        agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }

    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);


    return(
        <AppBar position="static" sx={{mb: 4}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            
                <Box display='flex' alignItems='center'>
                    <Typography variant="h6" 
                    component={NavLink}
                    to='/' 
                    sx={navStyles}
                    >
                        Zprime
                    </Typography>
                </Box>
                
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) =>
                    <ListItem 
                     component={NavLink} 
                     to={path} 
                     key={path} 
                     sx={navStyles}
                    >
                        {title.toUpperCase()}
                    </ListItem>)}
                </List>

                <Box display='flex' alignItems='center'>
                <IconButton component={Link} to="/basket" size='large' edge='start' color='inherit' sx={{mr: 2}}>
                    <Badge badgeContent={itemCount} color="secondary">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
                
                    {user ? (
                        <SignedInMenu />
                    ) : (
                        <List sx={{display: 'flex'}}>
                            {rightLinks.map(({title, path}) =>
                            <ListItem 
                            component={NavLink} 
                            to={path} 
                            key={path} 
                            sx={navStyles}
                        >
                        {title.toUpperCase()}
                          </ListItem>)}
                         </List>    
                    )}
                
                </Box>
                
            </Toolbar>

        </AppBar>
    )
}