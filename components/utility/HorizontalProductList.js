import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native'
import { useLocation } from '../../contexts/LocationContext';
import { useLocationLoading } from '../../contexts/LocationContext';
import ProductCard from '../utility/ProductCard'
import { useEffect, useState } from 'react';
import axios from 'axios'

const HorizontalProductList = ({ filter }) => {
    const { width } = useWindowDimensions();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedLocation = useLocation();
    const locationLoading = useLocationLoading();

    const fetchData = async () => {
        const availablePincodes = selectedLocation.pincodes;

        const { data } = await axios.post(
            `https://mazinda.com/api/product/fetch-products?filter=${filter}`,
            {
                availablePincodes,
            }
        );
        if (data.success) {
            setProducts(data.products);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (Object.keys(selectedLocation).length !== 0) {
            fetchData();
        }
    }, [selectedLocation, locationLoading]);

    if (loading) {
        return <View style={{
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator size={'small'} />
        </View>
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {products.map(item =>
                <View key={item._id} style={{
                    width: width / 2.25,
                }}>
                    <ProductCard item={item} />
                </View>
            )}
        </ScrollView>
    )
}

export default HorizontalProductList;