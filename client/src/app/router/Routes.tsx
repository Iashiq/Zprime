import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import BasketPage from "../../features/Basket/BasketPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Orders from "../../features/orders/Orders";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // {
            //     element: <RequireAuth />, children: [
            //         { path: 'checkout', element: <CheckoutPage /> }
            //     ]
            // },
            { path: '', element: <HomePage /> },
            { path: 'catalog', element: <Catalog /> },
            { path: 'catalog/:id', element: <ProductDetails /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'orders', element: <Orders /> }
            

        ]
    }
])