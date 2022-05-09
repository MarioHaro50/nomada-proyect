import { StyleSheet, View, Text, Image } from 'react-native';

const Movie = (props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{props.titleMovie}</Text>
        <Text style={styles.desc}>{props.description}</Text>
      </View>
      <View style={styles.imgContainer}>
        {
          props.img !== null ? (
            <Image
              source={{uri:`https://image.tmdb.org/t/p/w500${props.img}`}}
              style={styles.imgMovie}
            />
          ) : <Text>N/A</Text>
        }
        <Text style={styles.val}>⭐{props.val}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    padding: 15,
    backgroundColor: '#E2E8F0',
    borderRadius: 15
  },

  title: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 28
  },

  desc: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14
  },

  val: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 15
  },

  infoContainer: {
    width: '55%',
    marginRight: 10
  },

  imgContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  imgMovie: {
    width: 140,
    height: 210,
    borderRadius: 20
  }
});

export default Movie;