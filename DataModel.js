import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';

class DataModel {
  constructor() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    this.usersRef = firebase.firestore().collection('users');
    this.fridgesRef = firebase.firestore().collection('fridges');
    this.foodsRef = firebase.firestore().collection('foods');
    
    this.users = [];
    this.fridges = [];
    this.foods = [];

    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    this.loadFridges();
    this.loadFoods();
  }

  loadUsers = async () => {
    let querySnap = await this.usersRef.get();
    querySnap.forEach(qDocSnap => {
      let key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      this.users.push(data);
    });
  }

  getUsers = () => {
    return this.users;
  }

  createUser = async (email, pass, dispName) => {
    // assemble the data structure
    let newUser = {
      email: email,
      password: pass,
      displayName: dispName
    }
    // add the data to Firebase (user collection)
    let newUserDocRef = await this.usersRef.add(newUser);
    // get the new Firebase ID and save it as the local "key"
    let key = newUserDocRef.id;
    newUser.key = key;
    this.users.push(newUser);
    return newUser;
  }

  getUserForID = (id) => {
    for (let user of this.users) {
      if (user.key === id) {
        return user;
      }
    }
  }

  // load data to this.fridges
  loadFridges = async () => {
    // get all of the fridge documents from FB
    let querySnap = await this.fridgesRef.get();
    // go through all of them, and...
    querySnap.forEach(qDocSnap => {
      // create the skeleton of the DataModel fridge object
      let thisFridge = {
        key: qDocSnap.id,
        fridgeName: '',
        fridgeOwner: '',
      }
      // get the data from the FB chat document
      let data = qDocSnap.data();
      // get data's fridgeName & fridge Owner
      thisFridge.fridgeName = data.fridgeName
      thisFridge.fridgeOwner = data.fridgeOwner
      //now the fridge *object* is (mostly) ready, so add it to the 'fridges' array
      this.fridges.push(thisFridge);
    });
  }
    
  // get the fridge with user ID
  getFridgeWithUserID = (id) => {
    let list = []
    for (let fridge of this.fridges) {
      if (fridge.fridgeOwner === id) {
        let data = {
          key: fridge.key,
          fridgeName: fridge.fridgeName,
          fridgeOwner: fridge.fridgeOwner,
        }
        list.push(data)
      }
    }
    return list
  }

  // add new fridge section
  addFridge = async (newFridgeName, userId) => {
    if (newFridgeName) { // false if undefined
      // assemble the data structure
      // add the data to Firebase (fridges collection)
      let newFridgeDocRef = await this.fridgesRef.add({fridgeName: newFridgeName, fridgeOwner: userId,})
      // create a local food object with full-fledged user objects (not just keys)
      let newFridge = {
        key: newFridgeDocRef.id, // use the Firebase ID
        fridgeName: newFridgeName,
        fridgeOwner: userId,
      }
      // add the new fridge object to the data model's 'fridges'
      this.fridges.push(newFridge);
      // return the fully-constituted fridge object to the client (Screen)
      return newFridge;
    }
  }

  // update existing fridge section
  updateFridge = async (fridgeId, newFridgeName) => {
    let fridgeRef = this.fridgesRef.doc(fridgeId); //get a ref to the doc
    await fridgeRef.update({fridgeName: newFridgeName})
    let itemIndex = -1; // to store the index of the fridge to delete
    for (let i in this.fridges) {
      if (this.fridges[i].key === fridgeId) {
        itemIndex = i; // found it!
        break;
      }
    }
    if (itemIndex !== -1) {
      this.fridges[itemIndex].fridgeName = newFridgeName //replace the FridgeName with the new one
    }
  }

  // delete existing fridge section
  deleteFridge = async (fridgeId) => {
    let fridgeRef = this.fridgesRef.doc(fridgeId); //get a ref to the doc
    await fridgeRef.delete(); // remove from FB
    // remove fridge from this.fridges
    let itemIndex = -1; // to store the index of the fridge to delete
    for (let i in this.fridges) {
      if (this.fridges[i].key === fridgeId) {
        itemIndex = i; // found it!
        break;
      }
    }
    if (itemIndex !== -1) {
      this.fridges.splice(itemIndex, 1) // remove fridge
    }
    // remove all food in this fridge
    // maybe work on this later
  }

  // load data to this.foods
  loadFoods = async () => {
    // get all of the food documents from FB
    let querySnap = await this.foodsRef.get();
    // go through all of them, and...
    querySnap.forEach(qDocSnap => {
      // create the skeleton of the DataModel chat object
      let thisFood = {
        key: qDocSnap.id,
        foodName: '',
        foodFridge: '',
        foodAmount: 0, // default as zero
        foodType: '',
        foodExpDate: ''
      }
    
      // get the data from the FB chat document
      let data = qDocSnap.data();
      // 20210402update: the foodExpDate download from FB is Timestamp formate, but I need ISO string
      let dateObject = data.foodExpDate.toDate();
      let dateIsoString = dateObject.toISOString();

      // get data's fields
      thisFood.foodName = data.foodName
      thisFood.foodFridge = data.foodFridge
      thisFood.foodAmount = data.foodAmount
      thisFood.foodType = data.foodType
      thisFood.foodExpDate = dateIsoString // now the exp date is in ISO string formate

      //now the food *object* is (mostly) ready, so add it to the 'fridges' array
      this.foods.push(thisFood);
    });
  }

  // get the fridge with fridge ID
  getFoodWithFridgeID = (id) => {
    let list = []
    for (let food of this.foods) {
      if (food.foodFridge === id) {
        // 20210402: remember! for this.foods, I used ISOstrings
        // and then convert the date object to ISO string below
        let data = {
          key: food.key,
          foodName: food.foodName,
          foodFridge: food.foodFridge,
          foodAmount: food.foodAmount,
          foodType: food.foodType,
          foodExpDate: food.foodExpDate, //20210403updateV2: local data is ISO strings anyway lol
        }
        list.push(data)
      }
    }
    return list
  }

  // add new food item
  addFood = async (newFoodName, newFoodAmount, newFoodType, newFoodExpDate, fridgeId) => {
    if (newFoodName) { // false if undefined
      // assemble the data structure
      // 20210402update: newFoodExpDate is an ISO string, but I want a Date object
      let dateObject = new Date(newFoodExpDate)
      // add the data to Firebase (foods collection)
      let newFoodDocRef = await this.foodsRef.add({
        foodName: newFoodName, foodFridge: fridgeId, foodAmount: newFoodAmount,
        foodType: newFoodType, foodExpDate: dateObject})
      // create a local food object with full-fledged user objects (not just keys)
      // 20210402: for local, I still use the ISO string
      let newFood = {
        key: newFoodDocRef.id, // use the Firebase ID
        foodName: newFoodName,
        foodFridge: fridgeId,
        foodAmount: newFoodAmount,
        foodType: newFoodType,
        foodExpDate: newFoodExpDate
      }
      // add the new food object to the data model's 'foods'
      this.foods.push(newFood);
      // return the fully-constituted food object to the client (Screen)
      return newFood;
    }
  }

  // update existing food item
  updateFood = async (foodId, newFoodName, newFoodFridge, newFoodAmount, newFoodType, newFoodExpDate) => {
    let foodRef = this.foodsRef.doc(foodId); //get a ref to the doc
    // 20210402: newFoodExpDate is an ISO string
    let dateObject = new Date(newFoodExpDate)
    let data = { // assmble the object
      foodName: newFoodName,
      foodFridge: newFoodFridge,
      foodAmount: newFoodAmount,
      foodType: newFoodType,
      foodExpDate: newFoodExpDate // update the ISO string to local
    }
    await foodRef.update({
      foodName: newFoodName,
      foodFridge: newFoodFridge,
      foodAmount: newFoodAmount,
      foodType: newFoodType,
      foodExpDate: dateObject}) // update Date object to FB
    let itemIndex = -1; // to store the index of the food to delete
    for (let i in this.foods) {
      if (this.foods[i].key === foodId) {
        itemIndex = i; // found it!
        break;
      }
    }
    if (itemIndex !== -1) {
      data.key = foodId; // since we will replace the item, need to insert the key
      this.foods[itemIndex] = data; // replace the item using the found index
    }
  }

  // delete existing food item
  deleteFood = async (foodId) => {
    let foodRef = this.foodsRef.doc(foodId); //get a ref to the doc
    await foodRef.delete(); // remove from FB
    // remove food from this.foods
    let itemIndex = -1; // to store the index of the food to delete
    for (let i in this.foods) {
      if (this.foods[i].key === foodId) {
        itemIndex = i; // found it!
        break;
      }
    }
    if (itemIndex !== -1) {
      this.foods.splice(itemIndex, 1) // remove fridge
    }
  }
}

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}