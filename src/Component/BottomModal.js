import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const BottomModal = props => {
  return (
    <Modal
      visible={props.visible}
      animationType={Platform.OS === 'android' ? 'slide' : 'none'}
      statusBarTranslucent={true}
      onRequestclose={props.onClose}
      onDismiss={props.onClose}
      transparent={true}>
      <View style={styles.modal}>
        <View style={{flex: 1 - props.size, zIndex: 100}}>
          <TouchableOpacity
            onPress={props.onClose}
            style={{width: '100%', height: '100%'}}>
            <View style={{flex: 1}} />
          </TouchableOpacity>
        </View>
        <View style={[styles.wrapper, {flex: props.size}]}>
          <View style={styles.header}>
            <Text
              style={[
                styles.modalHeader,
                props.indicator !== undefined && {textAlign: 'left'},
              ]}>
              {props.title}
            </Text>
            {props.indicator !== undefined && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={props.indicatorStyle}
                onPress={props.indicatorPress}>
                <Text style={props.indicatorStyle}>{props.indicator}</Text>
              </TouchableOpacity>
            )}
            {props.search && (
              <KeyboardAvoidingView>
              <View style={styles.search}>
                <Icon name={'search'} size={25} color={'#748389'} />
                <TextInput
                  placeholder={props.searchPlaceholder}
                  value={props.searchValue}
                  onChangeText={props.onSearch}
                  onEndEditing={props.getData}
                  style={styles.searchInput}
                />
              </View>
              </KeyboardAvoidingView>
            )}
          </View>
          {props.children}
          <TouchableOpacity
            style={[styles.cancelButton]}
            activeOpacity={0.8}
            onPress={props.bottomOnPress}>
            <Text style={[styles.cancel, props.backButtonStyle]}>
              {props.titleBottomButton}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  cancel: {
    color: '#0095E5',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  header: {
    position: 'relative',
  },
  addContent: {
    marginLeft: 10,
    maxWidth: '75%',
  },
  cancelButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  modal: {
    flex: 1,
    backgroundColor: '#00000029',
    justifyContent: 'flex-end',
  },
  modalSlicer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  iconContainer: {
    backgroundColor: '#0095E5',
    padding: 10,
    borderRadius: 10,
  },
  wrapper: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    padding: 20,
    fontWeight: 'bold',
    color: '#303638',
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingBottom: 10,
    textAlign: 'center',
  },
  addReport: {
    position: 'absolute',
    backgroundColor: '#0087DB',
    borderRadius: 100,
    padding: 10,
    alignItems: 'center',
    bottom: 0,
    right: 0,
    marginBottom: 15,
    marginRight: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  logo: {
    height: undefined,
    width: '18%',
    aspectRatio: 17 / 11,
  },
  logoTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  numChange: {
    fontSize: 12,
    color: '#F00404',
  },
  avatar: {
    borderRadius: 100,
    width: '17%',
    height: undefined,
    aspectRatio: 1 / 1,
    marginRight: 20,
  },
  bell: {
    position: 'relative',
  },
  badge: {
    backgroundColor: '#E80000',
    width: '40%',
    height: undefined,
    aspectRatio: 1 / 1,
    position: 'absolute',
    right: 0,
    borderRadius: 100,
    marginRight: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  role: {
    backgroundColor: '#00ABF4',
    borderWidth: 1,
    borderColor: '#0087DB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingBottom: 3,
    marginRight: 10,
  },
  roleName: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  roleContainer: {
    alignItems: 'center',
    paddingRight: 70,
  },
  roleMask: {
    marginTop: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  slicer: {
    borderWidth: 1,
    borderColor: '#303638',
    opacity: 0.1,
    marginVertical: 20,
  },
  statusName: {
    fontWeight: '500',
    color: '#303638',
    opacity: 0.5,
  },
  statusNum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    flex: 1,
  },
  bodyTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#303638',
  },
  expand: {
    fontWeight: 'bold',
    color: '#00ABF4',
  },
  contentImage: {
    width: '30%',
    height: undefined,
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 15,
    marginBottom: 10,
  },
  departement: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00A1ED',
  },
  projectName: {
    fontWeight: 'bold',
    color: '#303638',
    marginVertical: 3,
  },
  contentBody: {
    fontSize: 12,
    color: '#303638',
    opacity: 0.5,
  },
  contentText: {
    maxWidth: '75%',
    marginLeft: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: 'rgba(48, 54, 56, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
  },
  type: {
    fontWeight: 'bold',
    color: '#0A0A0A',
    opacity: 0.3,
  },
});
