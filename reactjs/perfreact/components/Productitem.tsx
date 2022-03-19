import { memo, useState } from "react";
import { AddProductToWishListProps } from "./AddProductToWishlist";
import dynamic from 'next/dynamic';

const AddProductToWishlist = dynamic<AddProductToWishListProps>(() => {
    return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist)
}, {
    loading: () => <span>Carregando....</span>
});

interface ProductItemProps {
    product: {
        id: number;
        price: number;
        priceFormatted: number;
        title: string;
    };
    onAddToWishlist(id: number): void;
}
function ProductItemComponent({ product, onAddToWishlist }: ProductItemProps) {
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    return (
        <div>
            {product.title} - <strong>{product.priceFormatted}</strong>
            <button onClick={() => setIsAddingToWishlist(true)}>Adicionar aos favoritos</button>

            {isAddingToWishlist && (
                <AddProductToWishlist
                    onAddToWishlist={() => onAddToWishlist(product.id)}
                    onRequestClose={() => setIsAddingToWishlist(false)}
                />
            )}
        </div>
    )
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
    return Object.is(prevProps.product, nextProps.product);
});