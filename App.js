import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button,TouchableOpacity } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
// import { Icon } from 'react-native-elements';


export default function App() {

  const [img, setImg] = useState("");
  const [nombreActor, setNombreActor] = useState("");

  
  //! ESTA FUNCION PIDE PERMISOS PARA PODER TENER ACCESO A TUS IMAGENES
  let abrirImagenAsync = async () => {
    let resultadoPermisos = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (resultadoPermisos.granted === false) {
      alert('Necesitas permisos para poder acceder.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }

    setImg({
      localUri: pickerResult.uri,
      type: pickerResult.type
    });

    console.log(img);

    const url = 'https://whois.nomada.cloud/upload';
    const formData = new FormData();

    formData.append('file', img.localUri);

    console.log(formData);

    const resultado = await fetch(url, {
      method: 'post',
      headers: {
        'Nomada': 'ZTA1YWNjOGUtOWRiMS00NThjLWE0ZTAtMzliYzgzZjRlY2I0'
      },
      body: formData
    });

    const datos = await resultado.json();
    setNombreActor(datos.error);
    console.log(formData);
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Busca una imagen</Text>
      <TouchableOpacity onPress={abrirImagenAsync}>
        <Image style={styles.img} source={img !== "" ? {uri:img.localUri} : {uri: 'https://i0.wp.com/i.pinimg.com/736x/a9/67/05/a9670576ee306eb165c4666ca38d98b1.jpg?ssl=1'}}/>
      </TouchableOpacity>
      <StatusBar style="auto" />
      { img ? (
          <>
            <Text style={styles.text} >Listo, su nombre es {nombreActor}</Text>
          </>
        ) : (
          <View/>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 35,
    fontStyle: 'italic',
    color: '#ddd',
    top: -10
  },

  img: {
    height: 280,
    width: 280,
    borderRadius: 80,
    margin: 40,
    // resizeMode: 'contain'
  },

  button: {
    backgroundColor: "#515E48",
    padding: 12,
    borderRadius: 6,
    padding: 10,
    margin:20
  },

  textButton: {
    color: '#E1B251',
    fontSize: 20
  }
});
