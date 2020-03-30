import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PanResponder, TouchableNativeFeedback, Alert, Modal, TextInput} from 'react-native';
import Canvas from 'react-native-canvas';
import { TapGestureHandler, PanGestureHandler, TouchableOpacity, FlatList } from 'react-native-gesture-handler'; 
import Node from './classes/Node';
import Line from './classes/Line';

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
    this.state = {
      nodes: [],
      title: "Draw Circle",
      isLine: false, 
      array: [],
      radius: 20,
      links: [],
      titleB: 'Selfloop disabled',
      modalVisible: false,
      evaluatorVisible: false,
      transition: '',
      tableVisible: false,
    };
  }

  drawLine = (evt) => {
    // let e = evt.nativeEvent;
    // let offset = {x: e.pageX - e.locationX, y: e.pageY - e.locationY};
    // console.log("touch made");
    this.setState({array: this.state.array.concat(evt.nativeEvent)});
    if (this.state.array.length == 2) {
      // console.log(this.state.array.length);
      // this.ctx.beginPath();
      // let e1 = this.state.array[0];
      // let e2 = this.state.array[1];
      // this.ctx.moveTo(e1.locationX, e1.locationY);
      // this.ctx.lineTo(e2.locationX, e2.locationY);
      // this.ctx.stroke();
      // console.log(this.state.array.length);
      let e1 = this.state.array[0];
      let e2 = this.state.array[1];
      // console.log("e1: " + e1.locationX + "," + e1.locationY);
      // console.log("e2: " + e2.locationX + "," + e2.locationY);
      let node1 = this.selectObject(e1.locationX, e1.locationY);
      // console.log (node1);
      let node2 = this.selectObject(e2.locationX, e2.locationY);
      // console.log(node2);
      if (node1 != null && node2 != null) {
        line = this.findLine(node1, node2);
        if (!line) {
          let currentLine = new Line(node1, node2);
          if (this.checkObject(node1, node2)) {
            console.log("Loop")
            let currentLine = new Line(node1, node2);
            currentLine.drawLoop(this.ctx, node1);
            this.setState({links: this.state.links.concat(currentLine), modalVisible: true});
          } else {
            console.log("Line");
            currentLine.drawManual(this.ctx, node1, node2);
            this.setState({links: this.state.links.concat(currentLine), modalVisible: true});
          }
          // }
        } else {
          //line exists - draw reverse link
          line.drawReverseManual(this.ctx, node2, node1);
        }
      } else {
        alert("Nodes required in order to draw a line! Please toggle 'Draw Circle'!");
      }
      this.setState({array: []});
    } else {
      // this.setState({array: []});
      // this.resetCanvas();
    }
    // console.log("touch = " + this.state.array.length);
    // console.log(this.state.array);

  }

  // containsPoint = (n, x, y) => {
  //   return ((((x - n.x) * (x-n.x)) + (y-n.y)*(y-n.y)) < ((this.radius) * (this.radius)));
  // } 

  evaluate(string, state){
    console.log(string.charAt(0));
    var str = '';
    var newstate = '';
    if (string == '') {
      console.log("checking accept state");
      return this.isAcceptState(state);
    } else {
      for (i = 0; i < this.state.links.length; i++) {
        console.log(i);
        console.log(this.state.links[i].nodeA.name + " " + state);
        console.log(this.state.links[i].transition + " " + string.charAt(0));
        if ((this.state.links[i].nodeA.name == state) && (this.state.links[i].transition == string.charAt(0))) {
          str = string.substring(1);
          newstate = this.state.links[i].nodeB.name;
          console.log(str + " + " + newstate);
          return this.evaluate(str, newstate);
        }
      }
      console.log("this triggered false");
      return false;
    }
  }

  isAcceptState = (state) => {
    for (var i = 0; i < this.state.nodes.length; i++) {
      if ((this.state.nodes[i].name == state) && (this.state.nodes[i].acceptState == true)) {
        return true;
      }
    }
  }

  selectObject = (x, y) => {
    for (i=0; i < this.state.nodes.length; i++) {
      if (this.state.nodes[i].containsPoint(x, y)) {
        return this.state.nodes[i];
      }
    }
    return null;
  }

  findLine = (node1, node2) => {
    for (i = 0; i < this.state.links; i++) {
      if (((this.state.links[i].nodeA.x == node1.x)  && (this.state.links[i].nodeA.y == node1.y)) && ((this.state.links[i].nodeB.x == node2.x) && (this.state.links[i].nodeB.y == node2.y))) {
        return this.state.links[i];
      }
    }
  }

  checkObject(node1, node2) {
    if ((node1.x === node2.x) && (node1.y === node2.y)) {
      return true;
    } else {
      return false; 
    }
  }

  handleCircle = (evt) => {
    // console.log("Touch registered");
    let n = this.selectObject(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
    if (n == null) {
        //  console.log(n);
        if (this.state.nodes.length == 0) {
          n = new Node(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
          n.setName("q0");
          alert("Start node set: " + n.getName());
          n.draw(this.ctx);
          this.setState({nodes: this.state.nodes.concat(n)});
        } else {
          n = new Node(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
          n.setName("q" + this.state.nodes.length);
          alert("Node name: " + n.getName());
          n.draw(this.ctx);
          this.setState({nodes: this.state.nodes.concat(n)});
        }
    } else {
      if (!n.acceptState) {
        n.acceptState = true;
        n.draw(this.ctx);
      }
    }
  }

  drawSelfLoop = (evt) => {
    let n = this.selectObject(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
    if (n != null) {
      console.log("Found node");
      loop = new Line(n, n);
      loop.drawLoop(this.ctx, n);
      this.setState({links: this.state.links.concat(loop), modalVisible: true});
    } else {
      alert("No node to draw a self loop on!");
    }
  }

  resetCanvas = () => {
    this.ctx.clearRect(0, 0, 1000, 1000);
    this.setState({nodes: [], array: [], links: []});
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(0, 0, 1000, 1000);
  }

  handleCanvas = (canvas) => {
    if (canvas != null) {
      this.ctx = canvas.getContext('2d');
      this.ctx.fillStyle = 'yellow';
      this.ctx.fillText("Hello", 10, 50);
      console.log("Text registered");
      this.ctx.fillRect(0, 0, 1000, 1000);
    } else {
      console.log("canvas is null");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Here's the canvas!</Text>
        {/* <PanGestureHandler> */}
          {/* <TapGestureHandler
            numberOfTaps={1}
            enabled={true}
            // onHandlerStateChange={this.handleCircle}
            onGestureEvent={this.handleCircle}> */}
            <View onStartShouldSetResponder={(evt) => true}
              onResponderRelease={(evt) => {
                if (this.state.isLine) {
                  this.drawLine(evt);
                } else {
                  this.handleCircle(evt);
                  }
                }
              }>
              <Canvas ref={this.handleCanvas} /> 
            </View>
          {/* </TapGestureHandler> */}
        {/* </PanGestureHandler> */}
        <Button title="Reset Canvas" onPress={this.resetCanvas} />
        <Button title={this.state.title} onPress={() => {
          this.setState({isLine: !this.state.isLine},() => console.log(this.state.isLine));
          if (this.state.title == "Draw Line") {
            this.setState({title: "Draw Circle"});
          } else {
            this.setState({title: "Draw Line"});
          }
        }} />
        {/* <Button title={this.state.titleB} onPress={() => {
          this.setState({isSelfLoop: !this.state.isSelfLoop}, () => console.log(this.state.isSelfLoop));
          if (this.state.titleB == "Selfloop disabled") {
            this.setState({titleB: "Selfloop enabled"});
          } else {
            this.setState({titleB: "Selfloop disabled"});
          }
        }} /> */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => alert("Modal closed")}
        >
          <View style={styles.container}>
            <Text>Enter the transition here.</Text>
            <TextInput placeholder="Enter the transition here" onChangeText={(text) => this.setState({transition: text})}/>
            <Button title="Set transition here" onPress={() => {
              let link = this.state.links[this.state.links.length-1];
              link.setName(this.state.transition);
              this.setState({modalVisible: false});
            }} />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.evaluatorVisible}
          onRequestClose={() => alert("Modal closed")}
          presentationStyle="pageSheet"
        >
          <View style={styles.container}>
            <Text>Please enter the string to evaluate: </Text>
            <TextInput placeholder="Enter the expression here" onChangeText={(text) => this.setState({str: text})}/>
            <Button title="Evaluate" onPress={() => {
              alert(this.evaluate(this.state.str, "q0"));
            }} />
            <Button title="Close Evaluator" onPress={() => this.setState({evaluatorVisible: false})} />
          </View>
        </Modal>
        <Button title="Open Evalator" onPress={() => this.setState({evaluatorVisible: true})} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.tableVisible}
          onRequestClose={() => alert("Modal closed")}
          presentationStyle="pageSheet"
        >
          <View style={styles.container}>
            {console.log(this.state.links)}
            <Text>Here is the transition table: </Text>
            <Text>Nodes | Transitions | Node travelled to:</Text>
            <FlatList
              data={this.state.links}
              renderItem={({item}) => (
              <Text>  {item.nodeA.name} |      {item.transition}     | {item.nodeB.name} </Text>
              )}
               />
            <Button title="Close Table" onPress={() => this.setState({tableVisible: false})} />
          </View>
        </Modal>
        <Button title="View Transition Table" onPress={() => this.setState({tableVisible: true})} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
