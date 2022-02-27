import { Dimensions, StyleSheet } from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#005bbb',
        borderWidth: 20,
    },
    greeting: {
        marginTop: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    max: {
        flex: 1,
    },
    buttonContainer: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#005bbb',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    spacer: {
        width: 10,
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5,
    },
    remoteContainerContent: {
        paddingHorizontal: 2.5,
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
});