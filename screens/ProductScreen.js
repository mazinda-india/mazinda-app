import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/CartReducer';
import { useState } from 'react';
import CheckoutModal from '../components/Modals/CheckoutModal';

const ProductScreen = ({ route }) => {
    const { item } = route.params;
    const { width, height } = useWindowDimensions();

    const [addedToCart, setAddedToCart] = useState(false);
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

    const dispatch = useDispatch();
    // const cart = useSelector(state => state.cart.cart)

    const addItemToCart = (item) => {
        dispatch(addToCart({ _id: item._id, quantity: item.quantity }));
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 3000);
    }

    const handleBuyNow = () => {
        setCheckoutModalVisible(true);
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white'
        }}>

            <ScrollView>

                <CheckoutModal checkoutModalVisible={checkoutModalVisible} setCheckoutModalVisible={setCheckoutModalVisible} />

                <Navbar />

                {/* Image Container View */}
                <View style={{ width: width, height: width, padding: 20 }}>

                    <Image
                        resizeMode='contain'
                        style={{ width: '100%', height: '100%' }}
                        source={{
                            uri: item.imagePaths[0]
                        }} />
                </View>

                {/* Product Name, pricing, mazinda features Container View */}
                <View style={{
                    paddingHorizontal: 10
                }}>
                    <Text style={{
                        fontSize: 20
                    }}>
                        {item.productName}
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                        marginVertical: 30,
                        marginHorizontal: 5,
                        alignItems: 'center'
                    }}>

                        <Text style={{
                            fontSize: 26,
                            fontWeight: 500
                        }}>
                            ₹{item.pricing.salesPrice}
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            marginTop: 4,
                            textDecorationLine: 'line-through',
                            color: 'gray'
                        }}>
                            ₹{item.pricing.mrp}
                        </Text>
                        <View style={{ backgroundColor: '#d3ffd8', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 20, height: 20 }}>
                            <Text style={{
                                color: '#57e28d',
                                fontWeight: 700,
                                fontSize: 12
                            }}>{String(
                                ((item.pricing.mrp - item.pricing.salesPrice) /
                                    item.pricing.mrp) *
                                100
                            ).slice(0, 4)}% OFF</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                        paddingHorizontal: 4,
                        borderRadius: 10,
                        justifyContent: 'space-between'
                    }}>
                        <View style={styles.mazinda_feature_box}>
                            <Image
                                style={styles.mazinda_feature_image}
                                source={require('../assets/item_desc_icons/delivery_30_min.png')
                                } />
                            <Text style={styles.mazinda_feature_text}>
                                Delivery Within 30 Mins
                            </Text>
                        </View>

                        <View style={styles.mazinda_feature_box}>
                            <Image
                                style={styles.mazinda_feature_image}
                                source={require('../assets/item_desc_icons/instant_refund.png')
                                } />

                            <Text style={styles.mazinda_feature_text}>
                                Instant Return
                            </Text>
                        </View>
                        <View style={styles.mazinda_feature_box}>

                            <Image style={styles.mazinda_feature_image} source={require('../assets/item_desc_icons/mazinda_delivered.png')
                            } />

                            <Text style={styles.mazinda_feature_text}>
                                Mazinda Delivered
                            </Text>
                        </View>

                        <View style={styles.mazinda_feature_box}>
                            <Image style={styles.mazinda_feature_image} source={require('../assets/item_desc_icons/pay_on_delivery.png')
                            } />
                            <Text style={styles.mazinda_feature_text}>
                                Pay On Delivery
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Buy now and add to cart button */}
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 20,
                    marginVertical: 50
                }}>
                    <TouchableOpacity onPress={handleBuyNow} style={{
                        backgroundColor: '#f17e13',
                        padding: 10,
                        borderRadius: 8,
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                    }}>
                        <AntDesign name="doubleright" size={24} color="white" />
                        <Text style={{
                            fontSize: 16,
                            color: 'white',
                            fontWeight: 600,
                        }}>
                            Buy Now
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        borderColor: '#f17e13',
                        borderWidth: 1.2,
                        padding: 10,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                    }}
                        onPress={() => addItemToCart(item)}
                    >
                        {addedToCart ?
                            <>
                                <AntDesign name="checkcircle" size={24} color="#f17e13" />
                                <Text style={{
                                    fontSize: 16,
                                    color: '#f17e13',
                                }}>
                                    Added To Cart
                                </Text>
                            </>
                            :
                            <>
                                <AntDesign name="shoppingcart" size={24} color="#f17e13" />
                                <Text style={{
                                    fontSize: 16,
                                    color: '#f17e13',
                                }}>
                                    Add To Cart
                                </Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>

                {/* Product Description */}
                <View>
                    {item.description.map((desc, index) =>
                        <View
                            key={index}
                            style={{
                                marginHorizontal: 18,
                                shadowColor: '#000000',
                                borderColor: 'lightgray',
                                borderWidth: 1,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 10
                            }}
                        >
                            <View style={{
                                borderBottomColor: 'lightgray',
                                borderBottomWidth: 1,
                                paddingVertical: 5
                            }}>
                                <Text style={{
                                    fontSize: 23,
                                    color: 'gray',
                                    textAlign: 'center'
                                }}>
                                    {desc.heading}
                                </Text>
                            </View>
                            <Text style={{
                                marginVertical: 15,
                                fontSize: 17,
                                marginHorizontal: 20
                            }}>
                                {desc.description}
                            </Text>
                        </View>)}
                </View>



            </ScrollView>

        </SafeAreaView>
    )
}

export default ProductScreen;

const styles = StyleSheet.create({
    mazinda_feature_box: {
        width: '22%',
        alignItems: 'center',
        gap: 10,
    },
    mazinda_feature_image: {
        width: 40,
        height: 40,
    },
    mazinda_feature_text: {
        textAlign: 'center'
    },
})