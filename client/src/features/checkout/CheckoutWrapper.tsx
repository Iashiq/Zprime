import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { setBasket } from "../Basket/basketSlice";

const stripePromise = loadStripe('pk_test_51P8ol105gsurKM0KkeT0QKyyiqFdkeCbfDugzZImyvLWl9xTFdwsaxpMQifGH4M1czOcelTn0brBFFE2uCxJw1b1001H7enkUt');

export default function CheckoutWrapper()
{
    const dispatch = useAppDispatch();

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
    }, [dispatch])
    

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}