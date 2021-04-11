import React from 'react';
import { TextInput, Text, View, Image,
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FridgeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class FridgeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    
    let allFridges = this.dataModel.getFridgeWithUserID(this.currentUser.key);
    this.state = {
      fridges: allFridges
    }
  }

  async componentDidMount() {
    this.setState({fridges: this.dataModel.getFridgeWithUserID(this.currentUser.key)});
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
  }

  async componentWillUnmount() {
    this.focusUnsubscribe();
  }

  onFocus = async () => {
    if (this.props.route.params) {
      const {operation, fridgeKey, newFridgeName} = this.props.route.params;
      if (operation === 'add') {
        await this.dataModel.addFridge(newFridgeName, this.currentUser.key);
      } else if (operation === 'edit') {
        await this.dataModel.updateFridge(fridgeKey, newFridgeName);
      } else if (operation === 'delete') {
        await this.dataModel.deleteFridge(fridgeKey);
        this.setState({fridges: []});
      }
    }
    this.setState({fridges: this.dataModel.getFridgeWithUserID(this.currentUser.key)});
    this.props.navigation.setParams({operation: 'none'});
  }

  onEdit = (item) => {
    this.props.navigation.navigate("EditFridge", {
      operation: 'edit',
      fridgeName: item.fridgeName,
      fridgeKey: item.key
    });
  }

  render() {
      
    return (
      <View style={FridgeStyles.container}>
        <View style={FridgeStyles.backgroudView}>
          <Image 
            source={require('./assets/logo-light50.png')}
            style={FridgeStyles.logoImage}
          />
          <Text style={FridgeStyles.subText}>
            Create fridge sections, add food to them to better keep track with your foods. 
          </Text> 
        </View>
        <View style={FridgeStyles.topView}>
          <View style={FridgeStyles.headerBlock}>
            <Text style={FridgeStyles.headerText}>My Fridge Sections</Text>
          </View>
          <View style={FridgeStyles.headerButtonBlock}>
            <TouchableOpacity style={FridgeStyles.buttonContainer}
              onPress={()=>
                this.props.navigation.navigate('EditFridge', 
                  {operation: "add"})}>
              <Ionicons name="ios-add" 
                size={36} 
                color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={FridgeStyles.bottomView}>
            <FlatList
              data={this.state.fridges}
              renderItem={({item})=>{
                return(
                  <View style={FridgeStyles.FridgeListItem}> 
                    <TouchableOpacity style={FridgeStyles.FridgeButtonContainer}
                      onPress={()=> 
                        this.props.navigation.navigate('Foods', 
                          {currentFridge: item})}
                    >
                      <Text style={FridgeStyles.FridgeListSubText}>
                        Fridge Section
                      </Text> 
                      <Text style={FridgeStyles.FridgeListText}>
                        {item.fridgeName}
                      </Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={FridgeStyles.cogButtonContainer}
                      onPress={()=> 
                        this.onEdit(item)}>
                      <Ionicons name="ios-more" 
                        size={28} 
                        color={colors.primaryLight} />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
        </View>
      </View>
    );
  }
}