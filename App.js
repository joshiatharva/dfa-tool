import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PanResponder, TouchableNativeFeedback } from 'react-native';
import WebView from 'react-native-webview';
import Canvas from 'react-native-canvas';

export default class App extends Component {
  constructor() {
    super();
    // this._panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: (evt, gestureState) => false,
    //   onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    //   onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //   onStartShouldSetPanResponderCapture: (evt, gestureState) => false,

    //   onPanResponderGrant: (evt, gestureState) => {
    //     console.log("touch accepted");
    //   },
    //   onPanResponderMove: (evt, gestureState) => {this.drawLink(evt, gestureState)},
    //   onPanResponderTerminationRequest: (evt, gestureState) => true, 
    // })
    this.ctx = null;
    this.node = null;
    this.radius = 20;
    this.state = {
      nodes: [],
      title: "Draw Circle",
      drawLines: false, 
      originX: null,
      originY: null,
    };
  }

  drawLink = (evt) => {
    // let e = evt.nativeEvent;
    // let offset = {x: e.pageX - e.locationX, y: e.pageY - e.locationY};
    this.ctx.beginPath();
    if (evt.nativeEvent.touches.length === 1) {
      console.log("1st touch");
      this.setState({originX: evt.nativeEvent.locationX, originY: evt.nativeEvent.locationY});
    }
    if (evt.nativeEvent.touches.length === 2) {
      console.log("2nd point");
      this.ctx.moveTo(this.state.originX, this.state,originY);
      this.ctx.lineTo(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      this.ctx.stroke();
    }
  }

  containsPoint = (n, x, y) => {
    return ((((x - n.x) * (x-n.x)) + (y-n.y)*(y-n.y)) < ((this.radius) * (this.radius)));
  } 

  selectObject = (x, y) => {
    for (i=0; i < this.state.nodes.length; i++) {
      if (this.containsPoint(this.state.nodes[i],x,y)) {
        return this.state.nodes[i];
      }
    }
    return null;
  }

  async handleCircle(evt) {
    console.log("Touch registered");
    n = this.selectObject(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
    if (n == null) {
      this.ctx.beginPath();
      this.ctx.arc(evt.nativeEvent.locationX, evt.nativeEvent.locationY, this.radius, 0, 2 * Math.PI, false);
      this.ctx.stroke();
      node = {
        x: evt.nativeEvent.locationX,
        y: evt.nativeEvent.locationY,
        acceptState: false,
      }
      this.setState(prevState => ({nodes: [...prevState.nodes, node]}));
    } else {
      if (!n.acceptState) {
        n.acceptState = true;
        console.log("Accept state:" + n.acceptState)
        this.ctx.beginPath()
        this.ctx.arc(n.x, n.y, this.radius+6, 0, 2* Math.PI, false);
        this.ctx.stroke();
      }
    }
  }



  resetCanvas = () => {
    this.ctx.clearRect(0, 0, 10000, 10000);
    // this.ctx.fillStyle = 'yellow';
    // this.ctx.fillRect(0, 0, 10000, 10000);
  }

  handleCanvas = (canvas) => {
    if (canvas != null) {
      this.ctx = canvas.getContext('2d');
      // this.ctx.fillStyle = 'yellow';
      // this.ctx.fillRect(0, 0, 10000, 10000);
    } else {
      console.log("canvas is null");
    }
  }
  render() {
    return (
      <View 
        // {...this._panResponder.panHandlers}
        style={styles.container}
        onStartShouldSetResponder={(evt) => true}
        onMoveShouldSetResponder={(evt) =>  true}
        onResponderRelease={(evt) => this.drawLink(evt)}

      >
        <Text>Here's the canvas!</Text>
        <Canvas ref={this.handleCanvas} />
        <Button title="Reset Canvas" onPress={this.resetCanvas} />
        <Button title={this.state.title} onPress={() => {
          this.setState({drawLines: !this.state.drawLines},() => console.log(this.state.drawLines));
          if (this.state.title == "Draw Line") {
            this.setState({title: "Draw Circle"});
          } else {
            this.setState({title: "Draw Line"});
          }
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
