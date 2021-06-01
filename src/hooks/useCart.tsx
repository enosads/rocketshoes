import {createContext, ReactNode, useContext, useState} from 'react';
import {Product} from '../types';
import {api} from "../services/api";
import {toast} from "react-toastify";

interface CartProviderProps {
    children: ReactNode;
}

interface UpdateProductAmount {
    productId: number;
    amount: number;
}

interface CartContextData {
    cart: Product[];
    addProduct: (productId: number) => Promise<void>;
    removeProduct: (productId: number) => void;
    updateProductAmount: ({productId, amount}: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({children}: CartProviderProps): JSX.Element {
    const [cart, setCart] = useState<Product[]>(() => {
        const storagedCart = localStorage.getItem('@RocketShoes:cart');

        if (storagedCart) {
            return JSON.parse(storagedCart);
        }
        return [];
    });

    const addProduct = async (productId: number) => {
        try {
            const stockResponse = await api.get(`stock/${productId}`);
            const stockAmount = stockResponse.data.amount;
            if (stockAmount === 0) {
                toast.error(`Produto esgotado.`);
                return;
            }
            const isProductInCart = cart.find(product => product.id === productId);
            const cartAmount = isProductInCart ? isProductInCart.amount : 0;
            if (cartAmount + 1 > stockAmount) {
                toast.error(`Há apenas ${stockAmount} unidades do produto no estoque.`);
                return;
            }
            const updatedCart = [...cart];
            if (isProductInCart) {
                isProductInCart.amount++;
                const index = updatedCart.indexOf(isProductInCart);
                updatedCart[index] = isProductInCart;
            } else {
                const productResponse = await api.get(`products/${productId}`)
                const newProduct = {
                    ...productResponse.data,
                    amount: 1
                }
                updatedCart.push(newProduct);
            }
            setCart(updatedCart);
        } catch {
            toast.error('Ocorreu um erro inesperado, tente novamente mais tarde.');
        }
    };

    const removeProduct = (productId: number) => {
        try {
            // TODO
        } catch {
            // TODO
        }
    };

    const updateProductAmount = async ({
                                           productId,
                                           amount,
                                       }: UpdateProductAmount) => {
        try {
            // TODO
        } catch {
            // TODO
        }
    };

    return (
        <CartContext.Provider
            value={{cart, addProduct, removeProduct, updateProductAmount}}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextData {
    return useContext(CartContext);
}
