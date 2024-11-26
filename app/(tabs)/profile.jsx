import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView, View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser, signOut, updateUserProfile } from "../../lib/appwrite"; // Make sure to add updateUserProfile function
import { InfoBox } from "../../components"; // Assuming you have this component for displaying stats like Seizure Alerts

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Manage editing state
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
    avatar: "", // New avatar URL or base64 string if changing
  });

  // Fetch the current user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserDetails(currentUser);
          setUpdatedUser({
            username: currentUser.username,
            email: currentUser.email,
            avatar: currentUser.avatar,
          });
        }
      } catch (err) {
        setError("Error fetching user details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle user log out
  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (err) {
      setError("Error signing out.");
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updated = await updateUserProfile(updatedUser.username, updatedUser.email, updatedUser.avatar);
      setUserDetails(updated);
      setIsEditing(false); // Stop editing mode after updating
    } catch (err) {
      setError("Error updating profile.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.profileSection}>
        {/* Display User Avatar */}
        <Image
          source={{ uri: userDetails?.avatar || "https://via.placeholder.com/80" }}
          style={styles.avatar}
        />

        {/* Editable Username */}
        {isEditing ? (
          <TextInput
            style={styles.inputField}
            value={updatedUser.username}
            onChangeText={(text) => setUpdatedUser({ ...updatedUser, username: text })}
          />
        ) : (
          <Text style={styles.username}>{userDetails?.username || "No Username"}</Text>
        )}

        {/* Editable Email */}
        {isEditing ? (
          <TextInput
            style={styles.inputField}
            value={updatedUser.email}
            onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
          />
        ) : (
          <Text style={styles.email}>{userDetails?.email || "No email provided"}</Text>
        )}

        {/* Avatar Update (optional) */}
        {isEditing && (
          <TextInput
            style={styles.inputField}
            placeholder="Avatar URL"
            value={updatedUser.avatar}
            onChangeText={(text) => setUpdatedUser({ ...updatedUser, avatar: text })}
          />
        )}
      </View>

      {/* Seizure Alerts and Contacts Stats */}
      <View style={styles.statsContainer}>
        <InfoBox title="Seizure Alerts" subtitle={`${userDetails?.alertsCount || 0}`} />
        <InfoBox title="Contacts" subtitle={`${userDetails?.contactsCount || 0}`} />
      </View>

      {/* Modify Profile Button */}
      {isEditing ? (
        <TouchableOpacity onPress={handleProfileUpdate} style={styles.saveButton}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
          <Text style={styles.editText}>Modify Profile</Text>
        </TouchableOpacity>
      )}

      {/* Log Out Button */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
  email: {
    marginTop: 5,
    fontSize: 16,
    color: "#FFF",
  },
  inputField: {
    marginTop: 10,
    padding: 12,
    width: 250,
    borderRadius: 6,
    backgroundColor: "#FFF",
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#2E2E3A",  // Dark background to match EmergencyContacts page vibe
    borderRadius: 6,
    alignItems: "center",
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#FFA001",  // Button color similar to EmergencyContacts page
    borderRadius: 6,
    alignItems: "center",
  },
  editText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#FF5C5C",  // Logout button color
    borderRadius: 6,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF5C5C",
    textAlign: "center",
  },
});

export default Profile;
