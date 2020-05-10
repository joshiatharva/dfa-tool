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
      evaluator: [],
      radius: 20,
      links: [],
      titleB: 'Selfloop disabled',
      modalVisible: false,
      evaluatorVisible: false,
      transition: '',
      tableVisible: false,
      str: ""
    };
  }

  /** Draws line between two nodes */
  drawLine = (evt) => {
    this.setState({array: this.state.array.concat(evt.nativeEvent)});
    if (this.state.array.length == 2) {
      let e1 = this.state.array[0];
      let e2 = this.state.array[1];
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

  }

  /** Evaluates string recursively using given State and remaining string */
  /** Alerts true if successful - false if not  */
  evaluate(string, state){
    if (string == "") {
      this.setState({evaluator: this.state.evaluator.concat(state+" -> "+string+" -> "+this.isAcceptState(state))});
      return this.isAcceptState(state);
    } else {
      var str = '';
      var newstate = '';
      for (i = 0; i < this.state.links.length; i++) {
        console.log(i);
        console.log(this.state.links[i].nodeA.name + " " + state);
        console.log(this.state.links[i].transition + " " + string.charAt(0));
        if ((this.state.links[i].nodeA.name == state) && (this.state.links[i].transition == string.charAt(0))) {
          str = string.substring(1);
          newstate = this.state.links[i].nodeB.name;
          this.setState({evaluator: this.state.evaluator.concat(state+" -> "+string+" -> "+newstate)});
          console.log(str.length + " + " + newstate);
          return this.evaluate(str, newstate); 
        } else {
          this.setState({evaluator: this.state.evaluator.concat(state+" -> "+string+" -> fail")});
        }
      }
      console.log("this triggered false");
      return false;
    }
  }

  /** CHecks whether state is accept state or not. */
  isAcceptState = (state) => {
    for (var i = 0; i < this.state.nodes.length; i++) {
      if ((this.state.nodes[i].name == state) && (this.state.nodes[i].acceptState == true)) {
        return true;
      }
    } return false;
  }

  /** Selects Node closest to location of touch */
  selectObject = (x, y) => {
    for (i=0; i < this.state.nodes.length; i++) {
      if (this.state.nodes[i].containsPoint(x, y)) {
        return this.state.nodes[i];
      }
    }
    return null;
  }

  /** Finds a line (if existant) within the set of edges */
  findLine = (node1, node2) => {
    for (i = 0; i < this.state.links; i++) {
      if (((this.state.links[i].nodeA.x == node1.x)  && (this.state.links[i].nodeA.y == node1.y)) && ((this.state.links[i].nodeB.x == node2.x) && (this.state.links[i].nodeB.y == node2.y))) {
        return this.state.links[i];
      }
    }
  }

  /** Check whether two objects are equal by their start/end points */
  checkObject(node1, node2) {
    if ((node1.x === node2.x) && (node1.y === node2.y)) {
      return true;
    } else {
      return false; 
    }
  }

  /** Draws circle on canvas */
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

  /** Draws a self-loop on one node */
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


  /** Removes all values from canvas */
  resetCanvas = () => {
    this.ctx.clearRect(0, 0, 1000, 1000);
    this.setState({nodes: [], array: [], links: []});
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(0, 0, 1000, 1000);
  }

  /** INitialises Canvas */
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

  /** Render the entire UI */
  render() {
    return (
      <View style={styles.container}>
        <Text>Here's the canvas!</Text>
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
            <TextInput placeholder="Enter the transition here" onChangeText={(text) => {
              if (text == "") {
                alert("Transitions must NOT be empty!");
              } else {
                this.setState({transition: text})
              }}}/>
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
            <TextInput placeholder="Enter the expression here" onChangeText={(text) => {this.setState({str: text})}}/>
            <Button title="Evaluate" onPress={() => {
              this.setState({evaluator: []});
              alert(this.evaluate(this.state.str, "q0"));
            }} />
            <Text>Output: </Text>
            {this.state.evaluator.map((item, index) => 
              <Text key={index}>{item}</Text>
            )}
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
          <View style={styles.tContainer}>
            <Text>Here is the transition table: </Text>
            <Text>Nodes | Transitions | Node travelled to:</Text>
              {this.state.links.map((item, index) => 
              <Text key={index}>  {item.nodeA.name} |      {item.transition}     | {item.nodeB.name} </Text>
              )}
              <View style={styles.spacer}></View>
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
  tContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
    marginTop: 50,
  }
});
