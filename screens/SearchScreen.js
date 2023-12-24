import { View, SafeAreaView, ActivityIndicator, FlatList } from 'react-native'

import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import axios from 'axios';
import ProductCard from '../components/utility/ProductCard';

const SearchScreen = ({ route }) => {
    const { searchQuery } = route.params;
    const selectedLocation = useLocation();
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const availablePincodes = selectedLocation.pincodes;

            const { data } = await axios.post(`https://mazinda.com/api/product/fetch-products?searchQuery=${searchQuery}`,
                {
                    availablePincodes,
                }
            )

            if (data.success) {
                setProducts(data.products);
            }
            setLoading(false);
        })()
    }, [searchQuery])

    const renderProductItem = ({ item }) => (
        <ProductCard item={item} />
    );

    if (loading) {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <Navbar searchQuery={searchQuery} />

                <View style={{
                    height: '90%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar searchQuery={searchQuery} />
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                style={{ marginTop: 10 }}
            />
        </SafeAreaView>
    )
}

export default SearchScreen;