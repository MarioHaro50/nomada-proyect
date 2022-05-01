import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity } from 'react-native';
// import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
// import { Icon } from 'react-native-elements';


export default function App() {

  const [img, setImg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [nombreActor, setNombreActor] = useState("");
  const [modal, setModal] = useState(false);
  const [datosActor, setDatosActor] = useState({})
  
  //! ESTA FUNCION PIDE PERMISOS PARA PODER TENER ACCESO A TUS IMAGENES
  let abrirImagenAsync = async () => {

    setIsPending(true);

    let resultadoPermisos = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (resultadoPermisos.granted === false) {
      alert('Necesitas permisos para poder acceder.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }

    setImg({uri: pickerResult.uri});

    let imgObject = {
      uri: pickerResult.uri,
      type: 'image/jpeg',
      name: 'photo.jpg'
    };

    console.log(img);

    const url = 'https://whois.nomada.cloud/upload';
    const formData = new FormData();

    formData.append('file', imgObject);

    const resultado = await fetch(url, {
      method: 'post',
      headers: {
        'Nomada': 'ZTA1YWNjOGUtOWRiMS00NThjLWE0ZTAtMzliYzgzZjRlY2I0'
      },
      body: formData
    });

    const datos = await resultado.json();

    setNombreActor(datos.actorName);
    obtenerInfo(datos.actorName);
    
    setModal(true);
    setIsPending(false);
  }
  
  const obtenerInfo = async nombre => {
    const urlInfo = `https://api.themoviedb.org/3/search/person?api_key=30db1237b9167f8afaf9e065b90d16b8&language=en-US&query=${nombre}&page=1&include_adult=true`;
    const requestOptions = {
      method: 'GET'
    };

    const resultadoInfo = await fetch(urlInfo, requestOptions);
    const newDatos = await resultadoInfo.json();
    setDatosActor(await newDatos.results);
  }

  const ordenarInfo = async () => {
    await datosActor.forEach(info => {
      info.known_for.forEach(i => {
        console.log(i.original_title);
      });
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Quien es el famoso?</Text>
      <TouchableOpacity onPress={abrirImagenAsync}>
        <Image style={styles.img} source={img !== null ? {uri:img.uri} : require('./assets/select.png')}/>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
      { img ? (
          <>
            { 
              isPending === false ? (
                <Modal
                  animationType='slide'
                  onDismiss={() => console.log('Cerrando modal')}
                  onShow={ordenarInfo}
                  // transparent
                  visible={modal}
                >
                  <Text style={styles.title}>{nombreActor}</Text>
                  <Image
                  style={styles.img}
                    source={{uri:img.uri}}
                  />
                  <Button
                    title='Regresar'
                    onPress={()=> setModal(false)}
                  />

                </Modal>
              ) : (
                null
              )
            }
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
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 48,
    fontStyle: 'normal',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0f172a'
  },

  text: {
    fontSize: 18,
    fontStyle: 'normal',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0f172a'
  },

  img: {
    height: 300,
    width: 300,
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
