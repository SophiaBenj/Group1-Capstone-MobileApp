import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { EmergencyContactCard } from "../../components/EmergencyContactCard";
import { addEmergencyContact, fetchEmergencyContacts, deleteEmergencyContact } from "../../lib/appwrite";

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const fetchedContacts = await fetchEmergencyContacts();
      setContacts(fetchedContacts || []);  // Default to empty array if undefined
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  // Add contact to Appwrite and update state
  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const savedContact = await addEmergencyContact(newContact);
      setContacts((prevContacts) => [...prevContacts, savedContact]);
      setNewContact({ name: "", phone: "" });
      Alert.alert("Success", "Contact added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save contact");
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    try {
      await deleteEmergencyContact(contactId);
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.$id !== contactId));
      Alert.alert("Success", "Contact deleted");
    } catch (error) {
      Alert.alert("Error", "Failed to delete contact");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Contact Name"
          value={newContact.name}
          onChangeText={(text) => setNewContact({ ...newContact, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          value={newContact.phone}
          onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TouchableOpacity onPress={addContact} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <EmergencyContactCard
              name={item.name}
              phone={item.phone}
            >
              <TouchableOpacity onPress={() => deleteContact(item.$id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </EmergencyContactCard>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
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
  inputContainer: {
    backgroundColor: "#2E2E3A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#FFA001",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  loadingText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});