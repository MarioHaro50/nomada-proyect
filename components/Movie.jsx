import { StyleSheet, View, Text, Image } from 'react-native';

const Movie = (props) => {
  return (
    <View>
      <Text>Titulo: {props.titleMovie}</Text>
      <Text>Descripción: {props.description}</Text>
      <Text>Valoración: {props.val}</Text>
      <Image
        source={{uri:`https://image.tmdb.org/t/p/w500${props.img}`}}
        style={{width:280, height: 300}}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default Movie;