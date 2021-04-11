import React from 'react';
import { TextInput, Text, View,
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';

import { EditFoodStyles, colors } from './Styles';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export class EditFood extends React.Component {
  constructor(props) {
    super(props);

    this.operation = this.props.route.params.operation;
    this.foodKey = this.props.route.params.foodKey;

    //TEST: for now, do not let user change foodFridge！
    let initFoodName = '';
    let initFoodAmount = '1'; //20210402update: qty is still a string:)
    let initFoodType = '';
    let initFoodExpDate = new Date(); //20210402update: change expDate to a Date object
    if (this.operation === 'edit') {
      initFoodName = this.props.route.params.foodName;
      initFoodAmount = this.props.route.params.foodAmount;
      initFoodType = this.props.route.params.foodType;
      initFoodExpDate = new Date(this.props.route.params.foodExpDate); // convert ISO string to Date
    }

    this.state = {
      inputFoodName: initFoodName,
      inputFoodAmount: initFoodAmount,
      inputFoodType: initFoodType,
      inputFoodExpDate: initFoodExpDate, //20210402update: change expDate to a Date object
    }
  }

  render() {
    {/* disable button when input is empty */}
    let inputIsEmpty = (
      (this.state.inputFoodName.length == 0) ||
      (this.state.inputFoodAmount <= 0) ||
      (this.state.inputFoodType.length == 0) ||
      (this.state.inputFoodExpDate.length == 0));
    // enable 'delete' button in edit mode
    let deleteButton;
    // let deleteCheck = 0;
    if (this.operation === 'edit') {
      // deleteCheck = 1;
      deleteButton = <TouchableOpacity
      style={EditFoodStyles.deleteButtonContainer}
      onPress={()=>{
        {/* update for delete confirmation */}
        Alert.alert(
          "Delete Food Item",
          "Are you sure you want to delete it?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => this.props.navigation.navigate("Foods", {
              operation: 'delete', // change operation to 'delete'
              foodKey: this.foodKey,
              newFoodName: this.state.inputFoodName, // pass the new data back
              newFoodAmount: this.state.inputFoodAmount,
              newFoodType: this.state.inputFoodType,
              newFoodExpDate: this.state.inputFoodExpDate.toISOString(), // convert the Date Object to ISO string
            })}
          ],
          { cancelable: false }
          );
      }}>
      <Text style={EditFoodStyles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>;
    } else {
      // deleteCheck = 2;
      deleteButton = <View/>;
    }

    return (
      <View style={EditFoodStyles.container}>
        <View style={EditFoodStyles.topView}>
          <Text style={EditFoodStyles.headerText}>
            {this.operation === 'add'? "Add" : "Edit"} Food Item
          </Text>
        </View>
        <View style={EditFoodStyles.middleView}>
          <View style={EditFoodStyles.inputRow}>
            <Text style={EditFoodStyles.subHeaderText}>Food Name</Text>
            <TextInput
            placeholder='Enter food name'
            style={EditFoodStyles.inputText}
            onChangeText={(text) => this.setState({inputFoodName: text})}
            value={this.state.inputFoodName}
          />
          </View>
          <View style={EditFoodStyles.twoElementsRow}>
            <View style={EditFoodStyles.qtyBlock}>
                <Text style={EditFoodStyles.subHeaderText}>Qty.</Text> 
                {/* - button  */}
                <View style={EditFoodStyles.qtyEdit}>
                  <TouchableOpacity disabled={(this.state.inputFoodAmount <= 1) ? true : false}
                    style={EditFoodStyles.qtyButton}
                    onPress={()=>{
                      let num = parseInt(this.state.inputFoodAmount);
                      num = num - 1;
                      this.setState({inputFoodAmount: num.toString()});
                    }}>
                    <Ionicons name="ios-remove-circle"
                            size={40} 
                            color={(this.state.inputFoodAmount <= 1) ? colors.grayDarker : colors.primaryLight} />
                  </TouchableOpacity>
                  <TextInput
                    placeholder='1'
                    style={EditFoodStyles.qtyText}
                    keyboardType = 'numeric' //20210402update
                    onChangeText={(text) => this.setState({inputFoodAmount: text.toString()})}
                    value={this.state.inputFoodAmount}
                  />
                  <TouchableOpacity disabled={(this.state.inputFoodAmount >= 99) ? true : false} // I set it to 99:)
                    style={EditFoodStyles.qtyButton}
                    onPress={()=>{
                      let num = parseInt(this.state.inputFoodAmount);
                      num = num + 1;
                      this.setState({inputFoodAmount: num.toString()});
                    }}>
                    <Ionicons name="ios-add-circle"
                            size={40} 
                            color={(this.state.inputFoodAmount >= 99) ? colors.grayDarker : colors.primaryLight} />
                  </TouchableOpacity>
                </View>
              </View>
            <View style={EditFoodStyles.expBlock}>
              <Text style={EditFoodStyles.subHeaderText}>Exp. Date</Text>
              <View style={EditFoodStyles.expInput}>
                <DateTimePicker
                  value={this.state.inputFoodExpDate}
                  mode='date'
                  display='calendar'
                  style={EditFoodStyles.datePickerBlock}
                  onChange={ (event, selectedDate) => {
                    // console.log("TEST: in EditFood, selectedDate = ", selectedDate.toDateString())
                    this.setState({inputFoodExpDate: selectedDate}) 
                    }}
                />
              </View>
            </View>
          </View>
          <View style={EditFoodStyles.inputRow}>
            < Text style={EditFoodStyles.subHeaderText}>Type</Text>
            <Picker
              selectedValue={this.state.inputFoodType}
              style={EditFoodStyles.typePickerBlock}
              itemStyle={EditFoodStyles.typePickerItem}
              onValueChange={(itemValue) =>
                this.setState({inputFoodType: itemValue})
              }>
              <Picker.Item label="Type: Fruit" value="Fruit" />
              <Picker.Item label="Type: Vegetable" value="Vegetable" />
              <Picker.Item label="Type: Instant Food" value="Instant Food" />
              <Picker.Item label="Type: Meat" value="Meat" />
              <Picker.Item label="Type: Sea Food" value="Sea Food" />
              <Picker.Item label="Type: Dessert" value="Dessert" />
              <Picker.Item label="Type: Hot Pot" value="Hot Pot" />
              <Picker.Item label="Type: Drink" value="Drink" />
            </Picker>
          </View>
          {deleteButton}
        </View>
        <View style={EditFoodStyles.bottomView}>
          <Text 
            style = {EditFoodStyles.cancelText}
            onPress={()=>{
              {/* update for delete confirmation */}
                Alert.alert(
                "Discard Change",
                "Are you sure you want to discard changes you made?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => this.props.navigation.navigate("Foods") }
                ],
                { cancelable: false }
                );
              }}>
            Cancel {this.operation === 'add'? "Add" : "Edit"}
          </Text>
          <TouchableOpacity disabled={inputIsEmpty ? true : false}
            style={EditFoodStyles.buttonContainer}
            onPress={()=>{
              this.props.navigation.navigate("Foods", {
                operation: this.operation,
                foodKey: this.foodKey,
                newFoodName: this.state.inputFoodName, // pass the new data back
                newFoodAmount: this.state.inputFoodAmount,
                newFoodType: this.state.inputFoodType,
                newFoodExpDate: this.state.inputFoodExpDate.toISOString(), // convert the Date Object to ISO string
              });
            }}>
            <Text style={EditFoodStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}