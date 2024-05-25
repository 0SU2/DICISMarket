import React from 'react'
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert, FlatList, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { createRandomThread, createRandomUser, generateThreads } from '@/utils/generate-dummy-data'
import Posts from '@/context/Posts';

import { styles } from '@/styles';
import { useAuth } from '@/context/AuthContext';
import { DocumentData, addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, publicacionesRef } from '@/context/firebase/FirebaseConfig';
import SelectDropdown from 'react-native-select-dropdown';

import { listAvilability, listCategory } from '@/utils/category-list';

export default function index() {
  const { getCurrentUserUid, getCurrenUsername, getCurrentUser } = useAuth();
  const { userName } = getCurrentUser();
  const { userUid } = getCurrentUserUid()
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userModalVisible, setUserModalVisible] = React.useState(false);
  const [publications, setPublications] = React.useState<DocumentData>([]);
  
  const [product, setProducto] = React.useState<string>('');
  const [price, setPrecio] = React.useState<string>('');
  const [description, setDescripcion] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [availability, setAvailability] = React.useState<boolean>();

  React.useEffect(() => {
    const loadPublications = async () => {
      const queryData = query(publicacionesRef, orderBy("createdAt", "desc"));
      const querySnapShot = await getDocs(queryData);
      
      let dataObtain:(DocumentData) = [];
      querySnapShot.forEach(doc => {
        dataObtain.push({...doc.data()});
      });

      setPublications(dataObtain);

    };
    loadPublications();
  }, [userName]);

  const closeModal = () => {
    setModalVisible(false);
    setProducto("");
    setPrecio('');
    setDescripcion('');
    setCategory('');
    setAvailability(false);
  }
  
  const handleGuardarPublicacion = async() => {
    try {
      const publicacionRef = await addDoc(collection(FIRESTORE_DB, 'publicaciones'), {
        availability,
        category,
        createdAt: serverTimestamp(),
        description,
        price,
        product,
        uidUser: 
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  
  const formatDate = ({timestamp}) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <View style={styles.publicationContainer} key={item.uidUser}>
      <Text style={styles.publicationHeader}>
        {item.username} - {formatDate(item.createdAt)}
      </Text>
      <Text style={styles.publicationDetail}>Product: {item.product}</Text>
      <Text style={styles.publicationDetail}>Price: {item.price}</Text>
      <Text style={styles.publicationDetail}>Description: {item.description}</Text>
      <Text style={styles.publicationDetail}>Category: {item.category}</Text>
      <Text style={styles.publicationDetail}>Availability: {item.avilability ? "Disponible" : "Agotado"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
          keyboardVerticalOffset={60}
        >
          <View style={[styles.modalView, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <TouchableOpacity
                onPress={() => closeModal()}
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
                placeholder="Precio"
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

              <SelectDropdown
                data={listCategory}
                onSelect={(selected) => {
                  setCategory(selected.title);
                }}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) || 'Categoria'}
                      </Text>
                      <AntDesign name={isOpen ? "up": "down" } size={14} color="black" />
                    </View>
                  );
                }}
                renderItem={(item, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && {backgroundColor: '#D2D9DF'}),
                      }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={true}
                dropdownStyle={styles.dropdownMenuStyle}
              />
 
              <SelectDropdown
                data={listAvilability}
                onSelect={(selected) => {
                  setAvailability(selected.title.includes("Disponible"));
                  console.log(availability);
                }}
                renderButton={(selectedItem, isOpen) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) || 'Disponibilidad'}
                      </Text>
                      <AntDesign name={isOpen ? "up": "down" } size={14} color="black" />
                    </View>
                  );
                }}
                renderItem={(item, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && {backgroundColor: '#D2D9DF'}),
                      }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownAvalibilityStyle}
              />

              {/* <TouchableOpacity onPress={handleGuardarPublicacion} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>SAVE</Text>
              </TouchableOpacity> */}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Publications List */}
      <Text style={styles.headerUsersPosts}>Publications from other users:</Text>
      <FlatList
        data={publications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.publicationsList}
      />

      
    </View>
  );

}
