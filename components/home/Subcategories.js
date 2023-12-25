import { ImageBackground } from "react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const data = [
  {
    _id: 1,
    name: "Electronics",
    imageUri:
      "https://img1.wsimg.com/isteam/ip/119e2d1b-0ed9-4a03-a51a-334684501753/news12_5.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=h:1000,cg:true",
  },
  {
    _id: 2,
    name: "Grocery",
    imageUri:
      "https://media.istockphoto.com/id/164981421/photo/large-group-of-food-shoot-on-white-backdrop.jpg?s=612x612&w=0&k=20&c=S3UjegrKBG-HyZdYQmOeBCk1Cfk7C7XZrUGb0n56Gy8=",
  },
  {
    _id: 3,
    name: "Footwear",
    imageUri:
      "https://images.hindustantimes.com/img/2022/12/22/1600x900/istockphoto-1279108197-170667a_1671687926903_1671687937504_1671687937504.jpg",
  },
  {
    _id: 4,
    name: "Electronics",
    imageUri:
      "https://img1.wsimg.com/isteam/ip/119e2d1b-0ed9-4a03-a51a-334684501753/news12_5.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=h:1000,cg:true",
  },
];

const renderSubcategory = ({ item }) => {
  return (
    <View
      style={{
        width: "50%",
        padding: 10,
        overflow: "hidden",
      }}
    >
      <ImageBackground
        source={{ uri: item.imageUri }}
        resizeMode="cover"
        style={{
          height: 145,
          borderColor: "lightgray",
          borderWidth: 1,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "black",
            width: "100%",
            height: 30,
            opacity: 0.5,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: 700,
              marginHorizontal: 7,
            }}
          >
            View More {" >"}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const Subcategories = () => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          What are you looking for ?
        </Text>

        <TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              textDecorationLine: "underline",
              marginRight: 10,
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderSubcategory}
        keyExtractor={(item) => item._id}
        numColumns={2}
        style={{
          marginTop: 10,
        }}
      />
    </>
  );
};

export default Subcategories;
