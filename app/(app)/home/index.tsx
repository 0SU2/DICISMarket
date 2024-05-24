import React from 'react'
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert, FlatList, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { createRandomThread, createRandomUser, generateThreads } from '@/utils/generate-dummy-data'
import Posts from '@/context/Posts';

import { styles } from '@/styles';
import { useAuth } from '@/context/AuthContext';

export default function index() {
  const { getCurrentUserUid, getCurrenUsername } = useAuth();
  const { userName } = getCurrenUsername();
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userModalVisible, setUserModalVisible] = React.useState(false);
  const [publications, setPublications] = React.useState([]);
  
  const [product, setProducto] = React.useState('');
  const [price, setPrecio] = React.useState('');
  const [description, setDescripcion] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [availability, setAvailability] = React.useState('');
  
  const formatDate = ({timestamp}:) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <View style={styles.publicationContainer}>
      <Text style={styles.publicationHeader}>
        {item.userName} - {item.division} - {formatDate(item.timestamp)}
      </Text>
      <Text style={styles.publicationDetail}>Product: {item.product}</Text>
      <Text style={styles.publicationDetail}>Price: {item.price}</Text>
      <Text style={styles.publicationDetail}>Description: {item.description}</Text>
      <Text style={styles.publicationDetail}>Category: {item.category}</Text>
      <Text style={styles.publicationDetail}>Availability: {item.availability}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>{`Welcomez ${userName}!`}</Text>
      <TouchableOpacity
        style={styles.buttonNewP}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>New Publication</Text>
        <AntDesign name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      {/* Modal for Product Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
          keyboardVerticalOffset={60}
        >
          <View style={[styles.modalView, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ position: 'absolute', top: -6, right: 0, zIndex: 1 }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text>{``}</Text>
              <TextInput
                value={product}
                onChangeText={setProducto}
                placeholder="Product"
                placeholderTextColor={'#9586A8'}
                style={styles.input}
              />
              <TextInput
                value={price}
                onChangeText={setPrecio}
                placeholder="Price"
                placeholderTextColor={'#9586A8'}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                value={description}
                onChangeText={setDescripcion}
                placeholder="Description"
                placeholderTextColor={'#9586A8'}
                style={[styles.input, { height: 100 }]}
                multiline
              />
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Category"
                placeholderTextColor={'#9586A8'}
                style={styles.input}
              />
              <TextInput
                value={availability}
                onChangeText={setAvailability}
                placeholder="Product availability"
                placeholderTextColor={'#9586A8'}
                style={styles.input}
              />
              <TouchableOpacity onPress={handleGuardarPublicacion} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>SAVE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Publications List */}
      <Text style={styles.header}>Publications from other users:</Text>
      <FlatList
        data={publications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.publicationsList}
      />

      {/* Button for User Greeting */}
      <TouchableOpacity
        onPress={() => setUserModalVisible(true)}
        style={{ position: 'absolute', top: 10, right: 20 }}
      >
        <AntDesign name="user" size={24} color="#2D0C57" />
      </TouchableOpacity>

      
    </View>
  );

}
