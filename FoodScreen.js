import React from 'react';
import { TextInput, Text, View, Image,
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class FoodScreen extends React.Component {
    constructor(props) {
      super(props);
  
      this.dataModel = getDataModel();
      this.currentFridge = this.props.route.params.currentFridge;
      
      let allFoods = this.dataModel.getFoodWithFridgeID(this.currentFridge.key);
      this.state = {
        foods: allFoods
      }
    }
  
    async componentDidMount() {
      this.setState({foods: this.dataModel.getFoodWithFridgeID(this.currentFridge.key)});
      this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    }
  
    async componentWillUnmount() {
      this.focusUnsubscribe();
    }
  
    onFocus = async () => {
      if (this.props.route.params) {
        const {operation, foodKey, newFoodName, newFoodAmount, newFoodType, newFoodExpDate} = this.props.route.params;
        // the newFoodExpDate passed back is an ISO string, but Date object
        // Date object is non-serializable, which can break some usage in navigation
        // I still want to put a Date(timestamp) on FB, but not the string
        // which is why I convert it back here
        if (operation === 'add') {
          await this.dataModel.addFood(newFoodName, newFoodAmount, newFoodType, newFoodExpDate, this.currentFridge.key);
        } else if (operation === 'edit') {
          await this.dataModel.updateFood(foodKey, newFoodName, this.currentFridge.key, newFoodAmount, newFoodType, newFoodExpDate);
        } else if (operation === 'delete') {
          await this.dataModel.deleteFood(foodKey);
          this.setState({foods: []});
        }
      }
      this.setState({foods: this.dataModel.getFoodWithFridgeID(this.currentFridge.key)});
      this.props.navigation.setParams({operation: 'none'});
    }
  
    onEdit = (item) => {
      this.props.navigation.navigate("EditFood", {
        operation: 'edit',
        foodName: item.foodName,
        foodFridge: item.foodFridge,
        foodAmount: item.foodAmount,
        foodType: item.foodType,
        foodExpDate: item.foodExpDate,
        foodKey: item.key
      });
    }

    // get the icon image with the type
    getIconWithType = (type, size, color) => {
      let iconName;

      if (type === 'Fruit') {
        iconName = 'ios-leaf'
      } else if (type === 'Vegetable') {
        iconName = 'ios-nutrition'
      } else if (type === 'Instant Food') {
        iconName = 'md-pizza'
      } else if (type === 'Meat') {
        iconName = 'ios-color-palette'
      } else if (type === 'Sea Food') {
        iconName = 'ios-quote'
      } else if (type === 'Dessert') {
        iconName = 'ios-ice-cream'
      } else if (type === 'Hot Pot') {
        iconName = 'md-flame'
      } else if (type === 'Drink') {
        iconName = 'ios-beer'
      } 

      return <Ionicons name={iconName} size={size} color={color} />;
    }

    foodIsExpired = (year, month, day) => {
      let expCheck = true;

      let currentDate = new Date();

      let currentYear = parseInt(currentDate.getFullYear());
      let currentMonth = parseInt(currentDate.getMonth()) + 1;
      let currentDay = parseInt(currentDate.getDate());

      if (year > currentYear) {
        expCheck = false;
      } else if (month > currentMonth) {
        expCheck = false;
      } else if (day > currentDay) {
        expCheck = false;
      }

      return expCheck;
    }
    
    render() {
      return (
        <View style={FoodStyles.container}>
          <View style={FoodStyles.backgroudView}>
          <Image 
            source={require('./assets/logo-light50.png')}
            style={FoodStyles.logoImage}
          />
          <Text style={FoodStyles.subText}>
            Add foods to your fridge, keep track with what you have.
          </Text> 
        </View>
          <View style={FoodStyles.topView}>
            <View style={FoodStyles.headerButtonBlock}>
              <TouchableOpacity style={FoodStyles.buttonContainer}
                  onPress={()=>{
                    this.props.navigation.navigate("Fridges");
                  }}>
                  <Ionicons name="ios-arrow-back" 
                    size={34} 
                    color={colors.primary} />
              </TouchableOpacity>
            </View>
          <View style={FoodStyles.headerBlock}>
            <Text style={FoodStyles.headerText}>Foods In {this.currentFridge.fridgeName}</Text>
          </View>
          <View style={FoodStyles.headerButtonBlock}>
            <TouchableOpacity style={FoodStyles.buttonContainer}
              onPress={()=>
                this.props.navigation.navigate('EditFood', 
                  {operation: "add"})}>
              <Ionicons name="ios-add" 
                size={36} 
                color={colors.primary} />
            </TouchableOpacity>
          </View>

          </View>
          <View style={FoodStyles.bottomView}>
              <FlatList
                data={this.state.foods}
                renderItem={({item})=>{

                  // now date will be the Date object that is converted from the ISO string
                  console.log("TEST: in FoodScreen, item.foodExpDate = ", item.foodExpDate);
                  let date = new Date(item.foodExpDate)
                  
                  let year = parseInt(date.getFullYear())
                  let month = parseInt(date.getMonth()) + 1
                  let day = parseInt(date.getDate())

                  let expCheck = this.foodIsExpired(year, month, day)
                  console.log("TEST: in FoodScreen, expCheck = ", expCheck);

                  return(
                    <View style={FoodStyles.FoodListItem}> 
                      <View style={FoodStyles.foodTypeIconContainer}>
                        {this.getIconWithType(item.foodType, 48, colors.primaryLight)}
                      </View>
                      <View style={FoodStyles.FridgeTextBlock}>
                        <Text style={FoodStyles.FoodTypeText}>
                          Type: {item.foodType}
                        </Text> 
                        <Text style={FoodStyles.FoodNameText}>
                          {item.foodName} - Qty: {item.foodAmount}
                        </Text> 
                        <Text style={ expCheck ? FoodStyles.FoodExpTextExpired : FoodStyles.FoodExpText}>
                        Exp. Date: {year}.{month}.{day}
                        </Text> 
                      </View>
                      <TouchableOpacity style={FoodStyles.cogButtonContainer}
                        onPress={()=> 
                          this.onEdit(item)}>
                        <Ionicons name="ios-arrow-dropright-circle" 
                          size={36} 
                          color={colors.secondaryLight} />
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