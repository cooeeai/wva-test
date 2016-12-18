import React, { Component } from 'react';
import SDK from '@watson-virtual-agent/client-sdk/lib/web';
import logo from './watson_logo.png';
import {
  BOT_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  BASE_URL
} from './config';

import './App.css';

class App extends Component {

  componentDidMount() {
    const textInput = document.getElementById('text-input');
    const submitBtn = document.getElementById('submit-btn');
    const output = document.getElementById('output');

    SDK.configure({
      XIBMClientID: CLIENT_ID,
      XIBMClientSecret: CLIENT_SECRET,
      baseURL: BASE_URL
    });

    SDK.start( BOT_ID )
      .then( response => {
        const chatID = response.chatID;
        const onRequest = message => {
          console.log('You:', message);
          output.value += '\nYou: ' + message + '\n';
        };
        const onResponse = response => {
          console.log(response);
          response.message.text.forEach( text => {
            console.log('Agent:', text);
            output.value += 'Agent: ' + text + '\n';
          });
        };
        onResponse( response );
        submitBtn.addEventListener('click', ()=> {
          const message = textInput.value;
          onRequest( message );
          SDK.send( BOT_ID, chatID, message )
            .then( onResponse )
            .catch( err => console.error( err ));
        });
        textInput.addEventListener('keyup', (ev) => {
          ev.preventDefault();
          if (ev.keyCode === 13) {
            submitBtn.click();
            textInput.value = '';
          }
        });
      })
      .catch( err => console.error( err ));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Watson Virtual Agent Chat Test</h2>
        </div>
        <div className="App-intro">
          <input type="text" id="text-input" autoComplete="off"/>
          <button type="button" id="submit-btn">Post</button>
          <br/>
          <textarea id="output" rows={20}></textarea>
        </div>
      </div>
    );
  }
}

export default App;
