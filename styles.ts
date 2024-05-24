import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    login: {
      width: 350,
      height: 500,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    register: {
      width: 350,
      height: 620,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: '#fff',
      borderWidth: 1,
      marginVertical: 30,
    },
    profilePictureRegister: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: '#fff',
      borderWidth: 1,
      marginVertical: 20,
    },
    inputContainerLogin: {
      backgroundColor: '#ffffff90',
      width: '80%',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#d7d7d7',
      paddingStart: 5,
      marginTop: 5,
      margin: 5
    },
    inputField: {
      padding: 9,
      fontSize: 15,
      width: '86%'
    },
    input: {
      width: 250,
      height: 40,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#ffffff90',
      marginBottom: 20
    },
    passwordInput: {
      width: 250,
      height: 40,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#ffffff90',
      marginBottom: 20
    },
    button: {
      width: 250,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      borderColor: '#fff',
      borderWidth: 1,
    },
    Text:{
      fontSize: 19, 
      color:'#2D0C57',
      fontWeight: 'bold'
    },
    textBienvenida: {
      fontSize: 40,
      marginBottom: 20,
      color: "#7421de",
      fontWeight: "bold",
    },
    modalView: {
      margin: 20,
      backgroundColor: '#F6F5F5',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 10,
      borderWidth: 2,
      borderColor: '#2D0C57',
      maxHeight: '65%',
      marginTop: '40%'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonNewP:{
      width: 200,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      borderColor: '#fff',
      borderWidth: 1,
      backgroundColor: '#918D96'
    },
    containerTAB: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    table: {
      marginTop: 20,
    },
    headerTAB: {
      flexDirection: 'row',
      backgroundColor: '#f1f1f1',
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    headerCell: {
      width: 120, // Ajusta este valor según sea necesario
      fontWeight: 'bold',
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    cell: {
      width: 120, // Ajusta este valor según sea necesario
      textAlign: 'center',
    },
    publicationContainer: {
      backgroundColor: '#EDEDED',
      padding: 10,
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    publicationHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    publicationDetail: {
      fontSize: 14,
      marginBottom: 5,
    },
    publicationsList: {
      paddingHorizontal: 10,
    },
  });