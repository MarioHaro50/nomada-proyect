import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ToastAndroid, Text, View, Image, Modal, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
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
  const [popularity, setPopularity] = useState('');
  const [errorsito, setErrorsito] = useState('');

  
  //! ESTA FUNCION PIDE PERMISOS PARA PODER TENER ACCESO A TUS IMAGENES
  let abrirImagenAsync = async () => {

    setIsPending(true);
    
    setImg(null);

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

    const url = 'https://whois.nomada.cloud/upload';
    const formData = new FormData();

    formData.append('file', imgObject);

    try {
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
      
      setErrorsito(datos.error);
      console.log(errorsito);

      setModal(true);
      setIsPending(false);
    } catch (e) {
      console.log('Se exedió el número de peticiones');
    }
    
  }
  
  const obtenerInfo = async nombre => {

    setIsPending(true);

    setDatosActor({});
  
    const urlInfo = `https://api.themoviedb.org/3/search/person?api_key=30db1237b9167f8afaf9e065b90d16b8&language=en-US&query=${nombre}&page=1&include_adult=false`;
    const requestOptions = {
      method: 'GET'
    };

    try {
      const resultadoInfo = await fetch(urlInfo, requestOptions);
      const newDatos = await resultadoInfo.json();

      setDatosActor(newDatos.results);

      setIsPending(false);
    } catch (e) {
      console.log('Se exedió el número de peticiones');
    }

  }

  const ordenarInfo = () => {

    setIsPending(true);

    setMovies([]);

    let moviesList = [];

    try{
       datosActor.map(info => {

        setImgActor(info.profile_path);
        setPopularity(info.popularity);
  
        info.known_for.map(i => {
  
          moviesList.push([i]);
  
        });
  
      });
    } catch(e) {
      if(e.messsage !== "undefined is not a function"){
        ToastAndroid.show(errorsito, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(e.messsage, ToastAndroid.SHORT);
      }
      setModal(false);
    }

    setMovies(moviesList);

    setIsPending(false);
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
                  styles={styles.modal}
                  animationType='slide'
                  onDismiss={() => console.log('Cerrando modal')}
                  onShow={ordenarInfo}
                  // transparent
                  visible={modal}
                >
                  <ScrollView>
                    <ImageBackground 
                      source={imgActor !== null ? {uri:`https://image.tmdb.org/t/p/w500${imgActor}`} : {uri:img.uri}}
                      
                      style={styles.fondo}
                    >

                      <View style={styles.botonContainer}>
                        <TouchableOpacity
                          onPress={()=> {
                            setMovies([]);
                            setImg(null);
                            setDatosActor({});
                            setNombreActor("");
                            setModal(false);
                          }}
                          style={styles.button}
                        >
                        <Text style={styles.button__Text}>↩</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.mainContainer}>
                        <Text style={styles.actorName}>{nombreActor}</Text>
                        <View style={styles.popContainer}>
                          <Text style={styles.pop}>Popularidad</Text>
                          <Text style={styles.calif}>⭐{popularity}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                    <View style={styles.theContainer}>
                      <Text style={styles.pelisTitle}>Peliculas:</Text>
                      {
                        (movies !== [] && datosActor !== {})  ?
                        movies.map( (m, i) => {
                          return(
                            m[0].original_title !== undefined || m[0].overview !== undefined ||
                            m[0].vote_average !== undefined || m[0].poster_path !== undefined  ? 
                            <Movie
                              key={i} 
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
                    </View>
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

  botonContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },

  button: {
    display: 'flex',
    backgroundColor: "#ffffff77",
    width: 65,
    height: 65,
    margin: 15,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },

  button__Text: {
    color: '#0f172a',
    fontWeight: 'bold',
  },

  textButton: {
    color: '#E1B251',
    fontSize: 20
  },

  fondo: {
    display: 'flex',
    width: '100%',
    height: 300,
    justifyContent: 'space-between'
  },

  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00000055'
  },

  popContainer: {
    display: 'flex'
  },

  pop: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
  },

  calif: {
    color: '#f1f5f9',
    fontSize:18,
    fontWeight: 'bold',
  },

  actorName: {
    color: '#f1f5f9',
    fontSize: 32,
    fontWeight: 'bold',
  },

  theContainer: {
    display: 'flex',
    margin: 5,
  },

  pelisTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
    marginLeft: 5
  }
});
