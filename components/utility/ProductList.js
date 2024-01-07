import { FlatList } from "react-native";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  const renderProductItem = ({ item }) => <ProductCard item={item} />;

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
    />
  );
};

export default ProductList;
