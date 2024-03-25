import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      username: '',
      admin: null,
      setToken: this.setToken,
      setUsername: this.setUsername,
      setAdmin: this.setAdmin
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
  };

  setUsername = (value) => {
    this.setState({ username: value });
  };

  setAdmin = (value) => {
    this.setState({ admin: value });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
