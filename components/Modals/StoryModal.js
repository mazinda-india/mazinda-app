import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Modal,
  SafeAreaView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import MazindaLogo from "../../assets/logo/logo_mazinda.png";

const StoryModal = ({ showStoryModal, setShowStoryModal, vendorStories }) => {
  const [stories, setStories] = useState([...vendorStories]);
  const { height, width } = useWindowDimensions();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout;

    if (showStoryModal) {
      // Reset loading state when current changes
      setLoading(true);

      timeout = setTimeout(() => {
        if (current !== stories.length - 1) {
          setCurrent(current + 1);
        } else {
          setShowStoryModal(false);
        }
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [current, showStoryModal]);

  const onImageLoad = () => {
    setLoading(false);
  };

  return (
    <Modal visible={showStoryModal} animationType="fade">
      <SafeAreaView
        style={{
          position: "relative",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Image
              source={MazindaLogo}
              style={{
                width: 100,
                height: undefined,
                aspectRatio: 3 / 1,
              }}
              resizeMode="contain"
            />

            <TouchableOpacity onPress={() => setShowStoryModal(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width,
              justifyContent: "space-evenly",
              flexDirection: "row",
              gap: 5,
            }}
          >
            {stories.map((story, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: current > index ? "#FFA500" : "#FFA50030",
                }}
              ></View>
            ))}
          </View>

          {/* Loading UI */}
          {loading && (
            <ActivityIndicator
              style={{
                marginVertical: 40,
              }}
              size="large"
              color="#FFA500"
            />
          )}

          <Image
            key={stories[current].product.imagePaths[0]}
            source={{ uri: stories[current].product.imagePaths[0] }}
            onLoad={onImageLoad}
            onError={onImageLoad} // Set loading to false in case of an error
            style={{
              marginTop: 100,
              width: 300,
              height: 300,
              // display: 'none'
            }}
            resizeMode="contain"
          />
        </View>

        {/* View for left right touch */}
        <View
          style={{
            width,
            height,
            position: "absolute",
            top: 110,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (current) {
                setCurrent(current - 1);
              }
            }}
            style={{
              width: "40%",
              height: "100%",
            }}
          ></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (current !== stories.length - 1) {
                setCurrent(current + 1);
              } else {
                setShowStoryModal(false);
              }
            }}
            style={{
              width: "40%",
              height: "100%",
            }}
          ></TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default StoryModal;
