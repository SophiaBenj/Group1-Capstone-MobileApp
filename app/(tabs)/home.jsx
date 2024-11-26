import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import { getSeizureAlerts } from "../../lib/appwrite";
import { EmptyState, AlertCard } from "../../components";

const Home = () => {
  const { data: alerts, refetch } = useAppwrite(getSeizureAlerts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <AlertCard
            timestamp={item.timestamp}
            severity={item.severity}
            location={item.location}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              Welcome to <Text style={styles.brandName}>SeizureShield</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Stay informed about your seizure alerts in real-time.
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Alerts</Text>
            <Text style={styles.emptySubtitle}>No seizure alerts detected</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA001" />
        }
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",  // Dark background for better contrast
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#2E2E3A",  // Subtle background for the header
    borderRadius: 8,
    margin: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  brandName: {
    color: "#FFA001",  // Accent color for the brand name
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#CFCFCF",
    textAlign: "center",
    marginTop: 8,
  },
  flatListContent: {
    paddingBottom: 80,  // Extra padding at the bottom for readability
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },
});
