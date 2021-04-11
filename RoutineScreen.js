import React from 'react';
import { TextInput, Text, View, Image,
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoutineStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class RoutineScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      routines: []
    }
  }

  render() {
      
    return (
      <View style={RoutineStyles.container}>
        <View style={RoutineStyles.backgroudView}>
          <Image 
            source={require('./assets/logo-light50.png')}
            style={RoutineStyles.logoImage}
          />
          <Text style={RoutineStyles.subText}>
            Create food purchasing routines and set up food reminders.
          </Text> 
        </View>
        <View style={RoutineStyles.topView}>
          <View style={RoutineStyles.headerBlock}>
            <Text style={RoutineStyles.headerText}>My Food Routines</Text>
          </View>
          <View style={RoutineStyles.headerButtonBlock}>
            <TouchableOpacity style={RoutineStyles.buttonContainer}
              onPress={()=>{
                  Alert.alert(
                  "Function Not Available",
                  "This tab is still under constuction.",
                  [
                    { text: "OK", onPress: () => console.log("Okay Pressed") }
                  ],
                  { cancelable: false }
                  );
                }}>
              <Ionicons name="ios-add" 
                size={36} 
                color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}