import React from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { styles } from '@/styles';
import { useAuth } from '@/context/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DocumentData, addDoc, collection, getDocs, onSnapshot, or, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { FIRESTORE_DB, publicacionesRef } from '@/context/firebase/FirebaseConfig';
import SelectDropdown from 'react-native-select-dropdown';

import { blurhash } from '@/utils/blurhas';
import { listAvilability, listCategory, listHomeCategory } from '@/utils/category-list';
import AllPostsComponent from '@/components/AllPosts';

export default function index() {
  const { getCurrentUserUid, getCurrenUsername, getCurrentUser } = useAuth();
  const { userName } = getCurrenUsername();
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userModalVisible, setUserModalVisible] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [publications, setPublications] = React.useState<DocumentData[]>([]);
  
  const [product, setProducto] = React.useState<string>('');
  const [price, setPrecio] = React.useState<string>('');
  const [description, setDescripcion] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [availability, setAvailability] = React.useState<boolean>();
  const [searchText, setSearchText] = React.useState('');
  const [filterCategory, setFilterCategroy] = React.useState<string>("Todos")

  const [imageUri, setImageUri] = React.useState(null);

  React.useEffect(() => {
    if(searchText) {
      console.log(searchText);
      const postsQuery = query(publicacionesRef, or(where("username", "==", searchText), where("product", "==", searchText)));
      let unsub = onSnapshot(postsQuery, (snapshot) => {
        let allPosts = snapshot.docs.map(doc => {
          return {...doc.data(), id: doc.id};
        });
        setPublications([...allPosts])
      })
      return unsub
     
    } 
    if(filterCategory != "Todos" && filterCategory) {
      console.log(filterCategory);
      const postsQuery = query(publicacionesRef, where("category", "==", filterCategory));
      let unsub = onSnapshot(postsQuery, (snapshot) => {
        let allPosts = snapshot.docs.map(doc => {
          return {...doc.data(), id: doc.id};
        });
        setPublications([...allPosts])
      })
      return unsub
      
    } 
    if (filterCategory == "Todos" ){
      const postsQuery = query(publicacionesRef, orderBy("createdAt", "desc"));
      let unsub = onSnapshot(postsQuery, (snapshot) => {
        let allPosts = snapshot.docs.map(doc => {
          return {...doc.data(), id: doc.id};
        });
        setPublications([...allPosts])
      })
      return unsub
      
    } 
  }, [searchText, filterCategory]);
  
  const closeModal = () => {
    setModalVisible(false);
    setProducto("");
    setPrecio('');
    setDescripcion('');
    setCategory('');
    setImageUri(null);
    setAvailability(false);
  }
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result && !result.cancelled && result.assets.length > 0) {
      console.log("Image URI:", result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    } else {
      console.log("Image selection cancelled or failed.");
    }
  };

  const handleGuardarPublicacion = async() => {
    setUploading(true);
    try {
      let imageUrl = '';
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(getStorage(), `images/${Date.now()}_${userName}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }
      const publicacionRef = await addDoc(publicacionesRef, {
        availability,
        category,
        createdAt: serverTimestamp(),
        description,
        price,
        product,
        imageUrl,
        uidUser: getCurrentUserUid(),
        username: getCurrenUsername()
      })
      console.log("post saved => ", publicacionRef.id);
      closeModal();
      setUploading(false);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={styles.container}>
 
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search by user or product"
          placeholderTextColor={'#9586A8'}
          style={styles.inputbarra}
        />
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.buttonNewP}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginRight: 5, alignSelf: 'center' }}>New Publication</Text>
          <AntDesign style={{ alignSelf: 'center' }} name="plus" size={14} color="white" />
        </TouchableOpacity>
        
        <SelectDropdown
          data={listHomeCategory}
          onSelect={(selected) => {
            setFilterCategroy(selected.title);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdownIndex}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginRight: 5, alignSelf: 'center' }}>
                  {(selectedItem && selectedItem.title) || 'Categoria'}
                </Text>
                <AntDesign name={isOpen ? "up": "down" } size={14} color="white" />
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

      </View>

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
                style={{ position: 'absolute', top: -2, right: 0, zIndex: 1 }}
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
                  setAvailability(selected.value);
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

              <TouchableOpacity onPress={pickImage} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>Select Image</Text>
              </TouchableOpacity>
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                  transition={200}
                  placeholder={{ blurhash }}
                />
              )}

              <TouchableOpacity onPress={handleGuardarPublicacion} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                {uploading ? (
                    <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>Uploading...</Text>
                  ) : (
                    <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>SAVE</Text>
                  )}
              </TouchableOpacity>
            </ScrollView>

          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Publications List */}
      <Text style={styles.headerUsersPosts}>Publications from other users:</Text>
      <FlatList
        data={publications}
        renderItem={({item}) => <AllPostsComponent item={item} /> }
        keyExtractor={(item) => item.id}
      />

      
    </View>
  );

}
