import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable, TextInput } from 'react-native'
import React from 'react'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig';
import SelectDropdown from 'react-native-select-dropdown';
import { listAvilability, listCategory } from '@/utils/category-list';

export default function MyOwnPosts ({ item }) {
  const [ buttonSendMessage, setButtonSendMessage ] = React.useState<boolean>(false);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ modalDelete, setModalDelete ] = React.useState<boolean>(false);
  const [ modalEdit, setModalEdit ] = React.useState<boolean>(false);
  const colorButtonMensajeModal = buttonSendMessage ? styles.modalButtonGray : styles.modalButtonGreen;
  
    // valores que recibe del registro
  const RegValues = (name:string, value:string) => forms({...input, [name]: value});
  const [ availability, setAvailability ] = React.useState<boolean>(true);
  const [ category, setCategory ] = React.useState<string>(item.category);
  const [input,forms] = React.useState({
    description: item.description,
    price: item.price,
    product: item.product,
  });

  const handelDeletePost = async() => {
    setLoading(true)
    try {
      const docRef = doc(FIRESTORE_DB, 'publicacion', item.id);
      await deleteDoc(docRef);
      setModalDelete(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handelEditPost = async() => {
    setLoading(true);
    try {
      const docRef = doc(FIRESTORE_DB, 'publicacion', item.id);
      await updateDoc(docRef, {
        availability: availability,
        category: category,
        description: input.description,
        price: input.price,
        product: input.product,
      });

      RegValues("description", item.description)
      RegValues("price", item.price)
      RegValues("product", item.product);
      setCategory(item.category);
      setLoading(false);
      setModalEdit(false);

    } catch (error) {
      console.log(error);
    }
  }

  return(
    <View style={styles.postsContainer}>
      <Spinner visible={loading} animation='fade' />
      
      {/* modal para confirmar la eleminacion del producto */}
      <Modal
        visible={modalDelete}
        transparent={true}
        animationType='slide'
        statusBarTranslucent={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalCardContet}>
            <Text style={styles.modalContentTittle}>Seguro de eliminar el articulo:</Text>
            <Text style={{ fontSize: 18, paddingTop: 10 }}>{item.product}</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignContent:'center' }}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: 'red', flexDirection: 'row'}]}
                onPress={() => setModalDelete(false)}
              >
                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, { flexDirection: 'row' }, colorButtonMensajeModal ]}
                onPress={() => handelDeletePost()}
              >
                <Text style={{ alignSelf: 'center', textAlign:'center', fontWeight: 'bold' }}>Estoy deacuerdo</Text>
              </Pressable>
            </View>
        
          </View>
        </View>
        
      </Modal>

      {/* Modal para editar el producto */}
      <Modal
        visible={modalEdit}
        transparent={true}
        animationType='slide'
        statusBarTranslucent={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalCardContet}>
            <Text style={styles.modalContentTittle}>Editar producto:</Text>

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

            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInputField}
                onChangeText={(text) => RegValues("product", text)}
                placeholder={"Product"}
              />
            </View>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInputField}
                onChangeText={(text) => RegValues("price", text)}
                placeholder={"Price"}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInputField}
                onChangeText={(text) => RegValues("description", text)}
                placeholder={"Description"}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignContent: 'center'}}>
              <Pressable 
                style={[styles.modalButton, { backgroundColor: 'red', flexDirection: 'row'}]}
                onPress={() => setModalEdit(false)}
              >
                <Text>Cancelar</Text>
              </Pressable>

              <Pressable 
                style={[styles.modalButton, colorButtonMensajeModal ]}
                onPress={() => handelEditPost()}
              >
                <Text>Aceptar</Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
        <Text style={{ fontWeight: '700', paddingHorizontal: 10, fontSize: 17, textTransform: 'capitalize' }}>{item.product}</Text>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={{ paddingLeft: 10, paddingRight: 2 }}>${item.price}</Text>
        <Text style={{ paddingHorizontal: 3 }}>•</Text>
        <Text style={[{ paddingHorizontal: 3 }, item.availability ? {color: 'green'} : {color:'red'} ]}>{item.availability ? "Disponible" : "Agotado"}</Text>
      </View>
      <View style={{ paddingVertical: 5, alignSelf: 'center', flexDirection: 'row' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', backgroundColor: '#9cd0fa', borderRadius: 5, paddingVertical: 10 , paddingHorizontal: 18, marginRight: 10 }}
          onPress={() => setModalDelete(true)}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
          <Text style={{ alignSelf: 'center' }}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', backgroundColor: '#c6c6c6', borderRadius: 5, paddingVertical: 10 , paddingHorizontal: 18, }}
          onPress={() => setModalEdit(true)}
        >
          <Feather name="edit" size={24} color="black" />
          <Text style={{ alignSelf: 'center' }}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#3e3e3e',
  },
  postsContainer: {
    width: 300,
    backgroundColor: '#EDEDED',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageProfile: {
    width: 50,
    height: 50, 
    borderRadius: 50 
  },
  mainContainer: {
    marginLeft: 10,
    flex: 1,
  },
  userUsername: {
    fontWeight: '700',
  },
  userContent: {
    lineHeight: 20,
    marginTop: 5,
  },
  userImageContet: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 10,
    borderRadius: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalCardContet: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContentTittle: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: '700'
  },
  modalButton: {
    width: '30%',
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalInputContainer: {
    backgroundColor: '#c1c1c1',
    color: 'black',
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    paddingStart: 5,
    marginTop: 10,
  },
  modalInputField: {
    padding: 8,
    fontSize: 14,
    width: '98%'
  },

  modalButtonGray: { backgroundColor: '#747474' },
  modalButtonGreen: { backgroundColor: 'green' },
  allPostBackgroundBlack: { backgroundColor: 'black' },
  allPostBackgroundWhite: { backgroundColor: 'white' },
  allPostColorTextBlack: { color: 'white' }, 
  allPostColorTextWhite: { color: 'black' },

  dropdownButtonStyle: {
    backgroundColor: '#c1c1c1',
    color: 'black',
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    paddingStart: 5,
    marginTop: 10,
  },
  dropdownButtonTxtStyle: {
    padding: 12,
    fontSize: 14,
    width: '93%'
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownAvalibilityStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    marginVertical: 4,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 200,
  },

})