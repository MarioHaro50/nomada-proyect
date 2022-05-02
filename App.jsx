import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity, ScrollView } from 'react-native';
// import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
// import { Icon } from 'react-native-elements';
import Movie from './components/Movie';


export default function App() {

  const [img, setImg] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [nombreActor, setNombreActor] = useState("");
  const [modal, setModal] = useState(false);
  const [datosActor, setDatosActor] = useState({});
  const [movies, setMovies] = useState([]);
  const [imgActor, setImgActor] = useState("");

  
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
    const urlInfo = `https://api.themoviedb.org/3/search/person?api_key=30db1237b9167f8afaf9e065b90d16b8&language=en-US&query=${nombre}&page=1&include_adult=false`;
    const requestOptions = {
      method: 'GET'
    };

    const resultadoInfo = await fetch(urlInfo, requestOptions);
    const newDatos = await resultadoInfo.json();

    setDatosActor(newDatos.results);
  }

  const ordenarInfo = () => {

    const moviesList = [];

     datosActor.map(info => {

      setImgActor( info.profile_path);

      info.known_for.map(i => {

        moviesList.push([i]);

      });

    });

    setMovies(moviesList);
  }

  console.log(imgActor);

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
                  styles={styles.modal}
                  animationType='slide'
                  onDismiss={() => console.log('Cerrando modal')}
                  onShow={ordenarInfo}
                  // transparent
                  visible={modal}
                >
                  <ScrollView>
                    <View>
                      <Image
                      style={styles.fondo}
                        source={imgActor !== null ? {uri:`https://image.tmdb.org/t/p/w500${imgActor}`} : {uri:img.uri}}
                      />
                      <Text style={styles.title}>{nombreActor}</Text>
                    </View>

                    {
                      movies.length !== 0 ?
                      movies.map( m => {
                        return(
                          m[0].original_title !== undefined || m[0].overview !== undefined ||
                          m[0].vote_average !== undefined || m[0].poster_path !== undefined  ? 
                          <Movie
                            key={m[0].id} 
                            titleMovie={m[0].original_title}
                            description={m[0].overview}
                            val={m[0].vote_average}
                            img={m[0].poster_path}
                          /> 
                          : 
                          <Movie
                            key={'N/A'} 
                            titleMovie={m[0].original_title}
                            val= {'N/A'}
                            img={'N/A'}
                          />
                        )
                      }) : null
                    }

                    <Button
                      title='Regresar'
                      onPress={()=> {
                        setMovies([]);
                      //   setImg(null);
                      //   setDatosActor({});
                      //   setNombreActor("");
                        setModal(false);
                      }}
                    />
                  </ScrollView>
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
  },
  modal: {
    overflow: 'scroll'
  },
  fondo: {
    width: '100%',
    height: 300
  }
});
