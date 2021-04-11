import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { loginStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'login',
      emailInput: '',
      displayNameInput: 'default', //the user name is not reallt needed here
      passwordInput: '', 
      passwordCheckInput: ''
    }
  }

  onCreateAccount = async () => {

    // check that this is a valid email (skipping this)
    // check password rules (skipping this)
    // check that passwords match (skipping this)
    // check that displayName isn't empty (skipping this)

    // check that user doesn't already exist
    let users = this.dataModel.getUsers();
    for (let user of users) {
      if (user.email === this.state.emailInput) {
        console.log("found matching user");
        Alert.alert(
          'Duplicate User',
          'User ' + this.state.emailInput + ' already exists.',
          [{ text: 'OK',style: 'OK'}]
        );
        return;
      } 
    } // made it through loop, no user exists!
    console.log("no matching user found, creating");
    let newUser = await this.dataModel.createUser(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput
    );
    this.props.navigation.navigate(
      'Home', { 
        screen: 'Fridge', 
        params: {
          screen: 'Fridges', 
          params: { currentUser: newUser 
          }
        }
      }
    );
  }

  onLogin = () => {
    let users = this.dataModel.getUsers();
    let email = this.state.emailInput;
    let pass = this.state.passwordInput;
    for (let user of users) {
      if (user.email === email) {
        if (user.password === pass) {
          // success!
          this.props.navigation.navigate(
            'Home', { 
              screen: 'Fridge', 
              params: {
                screen: 'Fridges', 
                params: { currentUser: user 
                }
              }
            }
          );
          return;
        }
      }
    }
    // we got through all the users with no match, so failure
    Alert.alert(
      'Login Failed',
      'No match found for this email and password.',
      [{ text: 'OK',style: 'OK'}]
    );
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={loginStyles.container}
        behavior={"height"}
        keyboardVerticalOffset={10}>
        {/* heading, the logo image */}
        <View style={loginStyles.topView}>
          <Image 
              source={require('./assets/logo.png')}
              style={loginStyles.logoImage}
            />
        </View>
        
        {/* input field */}
        <View style={loginStyles.middleView}>
          {/* email */}
          <View style={loginStyles.inputRow}>
            <View style={loginStyles.inputIcon}>
                <Ionicons name="ios-mail" 
                size={32} 
                color={colors.secondaryLight} />
            </View>
            <View style={loginStyles.inputLabel}>
              <TextInput
                style={loginStyles.inputText}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                textContentType='emailAddress'
                placeholder='EMAIL'
                placeholderTextColor= {colors.primaryLight}
                value={this.state.emailInput}
                onChangeText={(text)=>{this.setState({emailInput: text})}}
              />
            </View>
          </View>

          {/* password */}
          <View style={loginStyles.inputRow}>
            <View style={loginStyles.inputIcon}>
                  <Ionicons name="md-key" 
                  size={32} 
                  color={colors.secondaryLight} />
            </View>
            <View style={loginStyles.inputLabel}>
              <TextInput
                secureTextEntry={true} // hide password
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'
                placeholder='PASSWORD'
                placeholderTextColor= {colors.primaryLight}
                value={this.state.passwordInput}
                onChangeText={(text)=>{this.setState({passwordInput: text})}}
            />
            </View>
          </View>

          {/* re-enter password when create */}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <View style={loginStyles.inputIcon}>
                  <Ionicons name="md-key" 
                  size={32} 
                  color={colors.secondaryLight} />
              </View>
              <View style={loginStyles.inputLabel}>
                <TextInput
                  secureTextEntry={true} // hide password
                  style={loginStyles.inputText}
                  autoCapitalize='none'
                  autoCorrect={false}
                  textContentType='password'
                  placeholder='RE-ENTER PASSWORD'
                  placeholderTextColor= {colors.primaryLight}
                  value={this.state.passwordCheckInput}
                  onChangeText={(text)=>{this.setState({passwordCheckInput: text})}}
                />
              </View>
            </View>
          ):(<View/>)}

          {/* forgot password */}
          {this.state.mode === 'login' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.forgotText}>Forgot Password?</Text>
            </View>
          ):(<View/>)}
        </View>

        {/* buttons */}
        {this.state.mode === 'login' ? (
          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onLogin}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style = {loginStyles.registerText}>
             Don't have an account?&nbsp;
             <Text onPress={()=> this.setState({mode: 'create'})} style = {{ color: colors.secondaryLight, textDecorationLine: 'underline', }}>
              Register now.
              </Text>
            </Text>
          </View>
        ):(
          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onCreateAccount}
              >
              <Text style={loginStyles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text 
            style = {loginStyles.loginText}
            onPress={()=> this.setState({mode: 'login'})}>
            Login
            </Text>
            <Text style={loginStyles.termText}>By registering this account, you will have a wonderful holiday break.</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    )
  }
}