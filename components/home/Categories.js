import { useEffect, useState } from 'react'
import { Text, View, ScrollView, Image, useWindowDimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'

const Categories = () => {
    const { width, height } = useWindowDimensions();

    const [categories, setCategories] = useState([])

    useEffect(() => {
        (async () => {
            const { data } = await axios.post("https://mazinda.com/api/category/fetch-categories");

            if (data.success) {
                setCategories(data.categories);
            } else {
                return <Alert>Oops... Something Went Wrong !</Alert>;
            }
        })()
    }, [])


    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>

                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                    Categories
                </Text>

                <TouchableOpacity>
                    <Text style={{
                        fontSize: 16,
                        textDecorationLine: 'underline',
                        marginRight: 10
                    }}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
                marginVertical: 20
            }}
            horizontal>
            {categories.map(item =>
                <TouchableOpacity
                    key={item._id}
                    style={{
                        marginHorizontal: 5,
                        alignItems: 'center',
                        gap: 10,
                        width: width / 4,
                    }}
                >
                    <View style={{
                        borderRadius: '100%',
                        padding: 5,
                        overflow: 'hidden'
                    }}>

                        <Image
                            resizeMode='contain'
                            style={{
                                width: 120, height: 120,
                            }}
                            source={{ uri: item.categoryImage }}
                        />
                    </View>
                    <Text style={{
                        fontWeight: 600,
                        fontSize: 12,
                        textAlign: 'center',
                    }}>
                        {item.storeName}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
        </View>
    )
}

export default Categories