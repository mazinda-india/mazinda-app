import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
