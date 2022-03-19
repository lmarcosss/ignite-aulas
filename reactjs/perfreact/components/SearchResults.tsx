import { List, ListRowRenderer } from 'react-virtualized';
import { ProductItem } from "./Productitem";

interface SearchResultsProps {
    results: Array<{
        id: number;
        price: number;
        priceFormatted: number;
        title: string;
    }>;
    totalPrice: number;
    onAddToWishlist(id: number): void;
}

export function SearchResults({ results, onAddToWishlist, totalPrice }: SearchResultsProps) {
    const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
        return (
            <div key={key} style={style}>
                <ProductItem
                    product={results[index]}
                    onAddToWishlist={onAddToWishlist}
                />
            </div>
        )
    }
    
    return (
        <div>
            <h1>{totalPrice}</h1>
            <List
                height={300}
                rowHeight={30}
                width={900}
                overscanRowCount={5}
                rowCount={results.length}
                rowRenderer={rowRenderer}
            />
        </div>
    )
}