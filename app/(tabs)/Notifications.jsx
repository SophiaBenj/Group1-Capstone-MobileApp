import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import { getNotifications } from "../../lib/appwrite";
import { NotificationCard } from "../../components";

const Notifications = () => {
  const { data: notifications, refetch } = useAppwrite(getNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <Text style={styles.description}>
        Stay updated with real-time seizure alerts and activity notifications.
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NotificationCard
            message={item.message}
            timestamp={item.timestamp}
            style={styles.notificationCard}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFA001']}  // Orange color refresh control
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={onRefresh} // Optional: refresh action via a button
      >
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",  // Dark background for contrast
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#D1D1D6",
    textAlign: "center",
    marginBottom: 30,
  },
  notificationCard: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,  // Extra space at the bottom for readability
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#B3B3B3",
    fontSize: 18,
  },
  refreshButton: {
    position: "absolute",
    bottom: 10,
    right: 16,
    backgroundColor: "#FFA001",  // Bright orange button
    borderRadius: 50,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  refreshButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
