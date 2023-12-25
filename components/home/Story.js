import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

const data = [
  {
    _id: 1,
    storeName: "Simply Best",
    imageURI: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png",
  },
  {
    _id: 2,
    storeName: "Random Footwears",
    imageURI:
      "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/store.png",
  },
  {
    _id: 3,
    storeName: "Apni Dukaan",
    imageURI:
      "https://images.freeimages.com/365/images/previews/3b6/small-store-icon-psd-53185.jpg",
  },
  {
    _id: 4,
    storeName: "Simply Best",
    imageURI: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png",
  },
  {
    _id: 5,
    storeName: "Simply Best",
    imageURI: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png",
  },
];

const Story = () => {
  const { width, height } = useWindowDimensions();
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={{
        marginTop: 8,
        marginBottom: 20,
      }}
      horizontal
    >
      <TouchableOpacity
        style={{
          marginHorizontal: 5,
          alignItems: "center",
          gap: 10,
          width: width / 5,
          // borderColor: 'black',
          // borderWidth: 1
        }}
      >
        <View
          style={{
            borderColor: "orange",
            borderWidth: 3,
            borderRadius: 100,
            padding: 5,
            overflow: "hidden",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 60,
              height: 60,
            }}
            source={require("../../assets/logo/logo_mazinda_mini.png")}
          />
        </View>

        <Text
          style={{
            fontWeight: 600,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Mazinda
        </Text>
      </TouchableOpacity>
      {data.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={{
            marginHorizontal: 5,
            alignItems: "center",
            gap: 10,
            width: width / 5,
          }}
        >
          <View
            style={{
              borderColor: "orange",
              borderWidth: 3,
              borderRadius: 100,
              padding: 5,
              overflow: "hidden",
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                width: 60,
                height: 60,
              }}
              source={{ uri: item.imageURI }}
            />
          </View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {item.storeName.slice(0, 9)}..
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Story;

const styles = StyleSheet.create({});
