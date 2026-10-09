import { ShelfTile } from "components/product/shelf-tile";
import { Product } from "lib/shopify/types";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <li key={product.handle} className="list-none">
          <ShelfTile product={product} />
        </li>
      ))}
    </>
  );
}
