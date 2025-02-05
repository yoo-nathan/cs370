import React, {useState, useEffect} from 'react';
import { 
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView
  } from 'react-native';
import { getBMR } from '../../service/getService';
import { getDCT } from '../../service/getService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyID } from '../../service/chatService';



export default function MenuScreen({ navigation }) {
  const [menu, setMenu] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({});
  const [dct, setDCT] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMENU, setLoadingMENU] = useState(true);

  const showModal = (name) => {
    setIsModalVisible(true);
    const MENU = dct.find(item => item.menu === name)
    setMenu(MENU)
    //console.log(MENU)
    //console.log(id)
  }
  const hideModal = () => setIsModalVisible(false);

  useEffect(() => {
    const fetchBMRInfo = async () =>{
      const token = await AsyncStorage.getItem('userToken');
      const uid = await getMyID(token);
      console.log('uid: ',uid)
      const BMRInfo = await getBMR(uid);
      const DCTInfo = await getDCT(uid);
      setData(BMRInfo);
      setDCT(DCTInfo);
      console.log(data);
      setLoading(false);
      setLoadingMENU(false);
      // console.log(BMRInfo);
      // console.log("dct: ",DCTInfo);
    }
    fetchBMRInfo();
  }, []);
  const MACROS = {
    targetCalorie: data[0],
    carbs: data[1], 
    protein: data[2],
    fat: data[3]
  };
  
  const Item = ({item}) => (
    <SafeAreaView>
      <TouchableOpacity 
        style={styles.item}
        onPress={() => showModal(item.menu)}>
          <Text style={styles.optionTitle}>
              {item.menu}
          </Text>
      </TouchableOpacity>
      {menu &&(
        <Modal visible={isModalVisible}
        animationType='fade'
        transparent>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalCardView}>
              <ModalPopUp item = {menu}/>
              <Button title='Close' onPress={hideModal}/>
              
            </View>
          </View>
        </Modal>
      )}
        
      
    </SafeAreaView>
  );

  return (
    <ScrollView style={styles.container}>
          <Text style={styles.pageHead}> Diet Recommendation </Text>
          <HeaderCard MACROS={MACROS} loading={loading}/>
          <Text style={styles.subhead}>DCT Menu Recommendation</Text>
          {loadingMENU ? (
            <ActivityIndicator 
            size='large' 
            style={{
              padding:'5%'
            }}
            />
          ) : (
            <FlatList
              horizontal={true}
              data={dct}
              renderItem={({item}) => <Item item={item} />}
              style={styles.flatList}
            />
          )}
          <Text style={styles.pageHead}> Cox Menu Recommendations Coming Soon! </Text>
          
          
          
      </ScrollView>
  );
}

const ModalPopUp = ({item}) => (
  <View style={{alignContent:"center",justifyContent:'center'}}>
    <Text style={{
      fontSize:30, 
      fontWeight:'900', 
      textAlign:'center',
      paddingVertical: 20,
      marginHorizontal: 5
    }}
    >{item.menu}</Text>
    
    <Text></Text>
    
    <Text style={{
      fontSize: 16,
      fontWeight:'600',
      paddingVertical: 1,
      marginHorizontal: 10,
      marginTop: 20
    }}>Nutritional Information:</Text>
    <Text style={{
      fontSize: 16,
      fontWeight:'400',
      paddingVertical: 5,
      marginHorizontal: 25
    }}>Total Calories: {item.calorie}</Text>
    <Text style={{
      fontSize: 16,
      fontWeight:'400',
      paddingVertical: 5,
      marginHorizontal: 25
    }}>Carbs: {item.carbs}</Text>
    <Text style={{
      fontSize: 16,
      fontWeight:'400',
      paddingVertical: 5,
      marginHorizontal: 25
    }}>Protein: {item.protein}</Text>
    <Text style={{
      fontSize: 16,
      fontWeight:'400',
      paddingVertical: 5,
      marginHorizontal: 25
    }}>Fat: {item.fat}</Text>
  </View>
)


const HeaderCard = ({MACROS, loading}) => (
  <View style = {styles.headerCard}>
      
      {loading ? (
          <View style = {{flexDirection:'row', marginRight: 10, alignContent:'center', 
          justifyContent:'center'}}> 
            <Text style={styles.cardText}>Target Calories: </Text>
            <ActivityIndicator size='small' style = {{padding :5, paddingBottom: 10}}/>
          </View>
        ) : (
          <Text style = {styles.cardText}>
          Target Calories: {MACROS.targetCalorie} kcal 
          </Text>
      )}
      
      <View style={{
        flexDirection:'row', 
        alignContent:'center', 
        justifyContent:'center'}}>
      
        <Image resizeMode='contain'
          style={styles.iconImg}
          source={{uri:'https://cdn-icons-png.flaticon.com/512/1276/1276022.png'}}/>
        {loading ? (
          <View style = {{flexDirection:'row', marginRight: 10}}> 
            <Text style={styles.cardSubText}>: </Text>
            <ActivityIndicator size='small'/>
          </View>
        ) : (
          <Text style={styles.cardSubText}>
          : {MACROS.carbs}g 
          </Text>
        )}
        
        <Image resizeMode='contain'
          style={styles.iconImg1}
          source={{uri:'https://png.pngtree.com/png-clipart/20230923/original/pngtree-high-protein-foods-vector-icon-illustration-exercise-body-powder-vector-png-image_12665260.png'}}/>
        {loading ? (
          <View style = {{flexDirection:'row', marginRight: 10 }}> 
            <Text style={styles.cardSubText}>: </Text>
            <ActivityIndicator size='small'/>
          </View>
        ) : (
          <Text style={styles.cardSubText}>
          : {MACROS.protein}g 
          </Text>
        )}
        
        <Image resizeMode='contain'
          style={styles.iconImg}
          source={{uri:'https://static.thenounproject.com/png/3569311-200.png'}}/>
        {loading ? (
          <View style = {{flexDirection:'row'}}> 
            <Text style={styles.cardSubText}>: </Text>
            <ActivityIndicator size='small'/>
          </View>
        ) : (
          <Text style={styles.cardSubText}>
          : {MACROS.fat}g
          </Text>
        )}
        
      </View>
  </View>
)



const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  containerOld: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  textOld : { fontSize: 26, fontWeight: 'bold' },
  container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: '#373F51'
    },
    flatList:{
      height:screenHeight *0.3,
      flexGrow: 0
    },
    item: {
      backgroundColor: 'white',
      padding: 10,
      marginVertical: 10,
      marginHorizontal: screenWidth *0.04,
      borderRadius: 25, 
      width: screenWidth *0.92, // Fixed width for each item
      height: screenHeight * 0.25, // Fixed height for each item
      justifyContent: 'center',
      alignContent:'center'
      
    },
    title: {
      fontSize: 16,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: '700',
      flexWrap: 'wrap',
      textAlign: 'center',
      marginBottom: 10
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: '500',
      flexWrap: 'wrap',
      textAlign: 'center'
    },
    pageHead: {
      fontSize: 26,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
      paddingVertical: 15
    },
    headerCard: {
      backgroundColor: 'white',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: screenWidth* 0.04,
      borderRadius: 25,
      width: screenWidth* 0.92, // Fixed width for each item
      height: screenHeight * 0.2,
      justifyContent: 'center',
      alignContent:'center'
    },
    cardText : {
      fontSize: 22,
      fontWeight: '500',
      textAlign: 'center',
      paddingBottom: 10
    },
    cardSubText:{
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      marginVertical: 10,
      paddingHorizontal: 5,
      paddingRight: 15
    },
    subhead :{
      color: 'white',
      marginHorizontal: 10,
      fontWeight: '600',
      fontSize : 22,
      paddingVertical: 8,
      textAlign: 'center'
    },
    iconImg :{
      width: 35,
      height: 35,
      borderRadius: 5,
      paddingHorizontal: 10
    },
    iconImg1 :{
      width: 45,
      height: 45,
      borderRadius: 5,
      paddingHorizontal: 10,
      
    },
    modalViewContainer: { 
      flex: 1, 
      backgroundColor:'rgba(0,0,0,0.6)', 
      alignItems: 'center', 
      justifyContent: 'center', 
      
    }, 
    modalCardView : { 
      backgroundColor : 'rgba(255,255,255,1)' , 
      height : '55%' , 
      width : "85%", 
      borderRadius : 20, 
      alignItems : "center", 
      justifyContent : "center" 
    }, 
    hairline: {
      backgroundColor: 'black',
      height: 1,
      width: screenWidth * 0.8,
      //marginLeft:10,
      opacity:0.5
      
    },
})