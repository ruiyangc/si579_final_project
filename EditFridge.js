import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EditFridgeStyles, colors } from './Styles';

export class EditFridge extends React.Component {
  constructor(props) {
    super(props);

    this.operation = this.props.route.params.operation;
    this.fridgeKey = this.props.route.params.fridgeKey;

    let initText = '';
    if (this.operation === 'edit') {
      initText = this.props.route.params.fridgeName;
    }

    this.state = {
      inputText: initText
    }
  }

  render() {
    {/* disable button when input is empty */}
    let inputIsEmpty = (this.state.inputText.length == 0);

    // enable 'delete' button in edit mode
    let deleteButton;
    // let deleteCheck = 0;
    if (this.operation === 'edit') {
      // deleteCheck = 1;
      deleteButton = <TouchableOpacity
      style={EditFridgeStyles.deleteButtonContainer}
      onPress={()=>{
        {/* update for delete confirmation */}
        Alert.alert(
          "Delete Fridge Section",
          "Are you sure you want to delete it? All foods recorded in this fridge section will also be deleted.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => this.props.navigation.navigate("Fridges", {
              operation: 'delete', // change operation to 'delete'
              fridgeKey: this.fridgeKey,
              newFridgeName: this.state.inputText // pass the new fridgeName back
            })}
          ],
          { cancelable: false }
          );
      }}>
      <Text style={EditFridgeStyles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>;
    } else {
      // deleteCheck = 2;
      deleteButton = <View/>;
    }

    return (
      <View style={EditFridgeStyles.container}>
        <View style={EditFridgeStyles.topView}>
          <Text style={EditFridgeStyles.headerText}>
            {this.operation === 'add'? "Add" : "Edit"} Fridge Section
          </Text>
        </View>
        <View style={EditFridgeStyles.middleView}>
          <View style={EditFridgeStyles.inputRow}>
            <Text style={EditFridgeStyles.subHeaderText}>Fridge Section Name</Text>
            <TextInput
              placeholder='Enter fridge section name'
              style={EditFridgeStyles.inputText}
              onChangeText={(text) => this.setState({inputText: text})}
              value={this.state.inputText}
            />
          </View>
          {deleteButton}
        </View>
        <View style={EditFridgeStyles.bottomView}>
          <Text 
            style = {EditFridgeStyles.cancelText}
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
                  { text: "OK", onPress: () => this.props.navigation.navigate("Fridges") }
                ],
                { cancelable: false }
                );
              }}>
            Cancel {this.operation === 'add'? "Add" : "Edit"}
          </Text>
          <TouchableOpacity disabled={inputIsEmpty ? true : false}
            style={EditFridgeStyles.buttonContainer}
            onPress={()=>{
              this.props.navigation.navigate("Fridges", {
                operation: this.operation,
                fridgeKey: this.fridgeKey,
                newFridgeName: this.state.inputText // pass the new fridgeName back
              });
            }}>
            <Text style={EditFridgeStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}