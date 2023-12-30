import {
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import StoryModal from "../modals/StoryModal";
import { useState } from "react";

const Story = () => {
  const { width } = useWindowDimensions();

  const stories = useSelector((state) => state.stories.stories);

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedVendorStories, setSelectedVendorStories] = useState([]);

  // Ensure stories is an array before using array functions
  const storiesArray = Array.isArray(stories) ? stories : [];

  // Create a Set to keep track of unique vendor IDs
  const uniqueVendorSet = new Set();

  // Filter out stories with duplicate vendors
  const uniqueStories = storiesArray.filter((story) => {
    if (!uniqueVendorSet.has(story.storeDetails._id)) {
      uniqueVendorSet.add(story.storeDetails._id);
      return true;
    }
    return false;
  });

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
      {uniqueStories.map((story) => (
        <TouchableOpacity
          onPress={() => {
            // Filter stories of the selected vendor
            const selectedVendorStories = stories.filter(
              (s) => s.storeDetails._id === story.storeDetails._id
            );
            setSelectedVendorStories(selectedVendorStories);
            setShowStoryModal(true);
          }}
          key={story._id}
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
              source={{ uri: story.storeDetails.imageURI }}
            />
          </View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {story.storeDetails.storeName.slice(0, 9)}..
          </Text>
        </TouchableOpacity>
      ))}

      {showStoryModal && (
        <StoryModal
          showStoryModal={showStoryModal}
          setShowStoryModal={setShowStoryModal}
          vendorStories={selectedVendorStories}
        />
      )}
    </ScrollView>
  );
};

export default Story;
