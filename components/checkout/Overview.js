import { Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';

const Overview = ({ itemData, setItemData, itemDataLoading, pricing, setPricing }) => {
    if (itemDataLoading) {
        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ecf0ef'
        }}>
            <ActivityIndicator size='small' />
        </View>
    }

    return (
        <ScrollView style={{
            backgroundColor: '#ecf0ef',
        }}>

            {itemData.map((item, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        padding: 10,
                        gap: 8,
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <Image
                        style={{
                            width: 75,
                            height: 75
                        }}
                        source={{ uri: item.imagePaths[0] }} />
                    <View
                        style={{
                            flexDirection: 'column',
                            gap: 5
                        }}
                    >

                        <Text style={{
                            fontSize: 16
                        }}>
                            {item.productName.slice(0, 30)}...
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8
                        }}>

                            <Text style={{
                                fontSize: 18
                            }}>
                                ₹{item.pricing.salesPrice}
                            </Text>
                            <Text style={{
                                textDecorationLine: 'line-through',
                                color: 'gray'
                            }}>
                                ₹{item.pricing.mrp}
                            </Text>
                            <Text style={{
                                color: 'green'
                            }}>
                                {String(
                                    ((item.pricing.mrp - item.pricing.salesPrice) /
                                        item.pricing.mrp) *
                                    100
                                ).slice(0, 4)}% OFF
                            </Text>
                        </View>
                        <Text>Quantity: {item.quantity}</Text>
                    </View>
                    {/* <MaterialIcons name="navigate-next" size={24} color="black" /> */}
                </View>
            ))}

            <View style={{
                paddingHorizontal: 20,
                backgroundColor: 'white',
                paddingVertical: 15,
                borderTopColor: 'lightgray',
                borderTopWidth: 1
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 500,
                    marginBottom: 12
                }}>
                    Billing Details
                </Text>

                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        Subtotal
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        ₹{pricing.total_mrp}
                    </Text>

                </View>
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#57e28d',
                        fontWeight: 500
                    }}>
                        Discount
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#57e28d',
                        fontWeight: 500
                    }}>
                        - ₹{pricing.total_mrp - pricing.total_salesPrice}
                    </Text>

                </View>
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        Service Charge
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        ₹{pricing.service_charge}
                    </Text>

                </View>
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        Delivery Fees
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        ₹{pricing.delivery_fees}
                    </Text>

                </View>

                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        Additional Discount
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#535353'
                    }}>
                        ₹{pricing.additional_discount}
                    </Text>

                </View>

                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 8,
                    borderTopColor: 'lightgray',
                    borderTopWidth: 1,
                    paddingTop: 15
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 600
                    }}>
                        Total
                    </Text>

                    <Text style={{
                        fontSize: 20,
                        fontWeight: 600
                    }}>
                        ₹{pricing.total_salesPrice}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default Overview;
