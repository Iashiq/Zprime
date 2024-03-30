import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = 'http://localhost:5223/api';
axios.defaults.withCredentials = true;

const resposeBody = (response: AxiosResponse) => response.data;



axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
     const {data, status} = error.response as AxiosResponse;
     switch (status){
        case 400:
            if(data.errors)
            {
                const modelStateErrors: string[] = [];
                for(const key in data.errors){
                    if(data.errors(key))
                    modelStateErrors.push(data.errors(key))
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            toast.error(data.title);
            break;
        default:
            break;
     }
     return Promise.reject(error.response);
})

const requests = 
{
    get: (url: string) => axios.get(url).then(resposeBody),
    post: (url: string, body: {}) => axios.post(url).then(resposeBody),
    put: (url: string,body: {}) => axios.put(url).then(resposeBody),
    delete : (url: string) => axios.delete(url).then(resposeBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) =>requests.get(`products/${id}`)
}


const TestErrors = {
    get400Error: () => requests.get('ErrorHandling/bad-request'),
    get401Error: () => requests.get('ErrorHandling/unauthorized'),
    get404Error: () => requests.get('ErrorHandling/not-found'),
    get500Error: () => requests.get('ErrorHandling/server-error'),
    getValidationError: () => requests.get('ErrorHandling/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;