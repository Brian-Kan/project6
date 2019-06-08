import React, { Component } from 'react';
import firebase from './firebase.js'
import { send } from 'q';

class Main extends Component {
    constructor(){
        super()

        this.state = {
            displayList: [],
        }
    }

    // this is where we are pulling data from firebase.
    // we do not need to add anything else in here?
    componentDidMount(){
        // variable created to reference into firebase
        const dbRef = firebase.database().ref();

        // on value change in firebase, pull down response from database
        dbRef.on('value', (response) => {
            // variable to pull data from firebase so we can shove it into newState's box
            const newState = [];
            // response from firebase, which will be shoved into the data variable?
            const data = response.val()
    
            // let every key in firebase..state. we want to push the following data: id/ userListObject...
            for (let key in data) {

                newState.push({
                    id: key,
                    userListObject: data[key]
                })
            }
            // we update the state so we can call it/ render it 
            this.setState({
                displayList: newState
            })
        })
    }

    // we need to find a way to go into the userList and for every index go into the value... set a default state to it? and then update that state everytime we click on it?

    // create a function to update the values on button click by using .update()
    // we need to make it where its on click ADD +1 to it
    valueIncrease = (event) => {

        const firebaseKey = event.target.closest('.completeList').getAttribute('data-key');
        // console.log(firebaseKey);

        
        const dbRef = firebase.database().ref(); 
        
        // variable copy makes a copy of the current state of display list
        const copy = [...this.state.displayList]
        // variable target is the value of clicked on title
        const target = event.target.value
        // console.log(target)
        // console.log(this.state.displayList)
        // variable create: event.target is the button we are clicking on... (upvote button). when we use .closest... we are going to go up the parent tree until it finds the element with the class .completeList. Once we find the element of .completeList... get the attribute of data-id and return a value to us?
        const parentDiv = event.target.closest('.completeList').getAttribute('data-id');
        const keyValue = event.target.closest('.completeList').getAttribute('data-key');
        
        // grabs the vote value
        let currentVoteValue = copy[parentDiv].userListObject.userList[target].value;
        
        // increments the vote value by 1 and saves its in counter
        const counter  = currentVoteValue + 1;

        // we're taking the current state of the display list's vote value and updates it with counter?
        copy[parentDiv].userListObject.userList[target].value = counter;
        
        // so now we update this.state.displayList with the updated copy data. cool.
        this.setState({
            displayList: copy,
        }, () => {
            const dbRef = firebase.database().ref()

            dbRef.once('value', (response) => {
                const newData = response.val()

                for (let key in newData) {
                    if (key === keyValue) {
                        dbRef.child(key).child('userList').child(target).update({
                            value: this.state.displayList[parentDiv].userListObject.userList[target].value
                        })
                        
                    }
                    
                }
                
            })

                
        })
        
    }

    // exact same function as valueIncrease but decreases
    valueDecrease = (event) => {
        const firebaseKey = event.target.closest('.completeList').getAttribute('data-key');
        const dbRef = firebase.database().ref();
        const copy = [...this.state.displayList]
        const target = event.target.value
        const parentDiv = event.target.closest('.completeList').getAttribute('data-id');
        const keyValue = event.target.closest('.completeList').getAttribute('data-key');
        let currentVoteValue = copy[parentDiv].userListObject.userList[target].value;
        
        const counter = currentVoteValue - 1;

        copy[parentDiv].userListObject.userList[target].value = counter;

        this.setState({
            displayList: copy,
        }, () => {
            const dbRef = firebase.database().ref()

            dbRef.once('value', (response) => {
                const newData = response.val()

                for (let key in newData) {
                    if (key === keyValue) {
                        dbRef.child(key).child('userList').child(target).update({
                            value: this.state.displayList[parentDiv].userListObject.userList[target].value
                        })
                    }
                }
            })
        })
    }

    render(){
        return(
            <div>
                {this.state.displayList.map((list, index) => {
                    return(
                        <div 
                        className="completeList" 
                        data-id={index} 
                        data-key={list.id}
                        key={list.id}>
                            <h3>{list.userListObject.title}</h3>
                            <ul>
                                {list.userListObject.userList.map((show, index)=> {
                                    return(
                                        <li key={index}>
                                            <h3>{show.title}</h3>
                                            <div>
                                                <p>{show.value}</p>
                                                <button
                                                    className="upvote"
                                                    onClick={this.valueIncrease}
                                                    value={index}>Love
                                                </button>
                                                <button
                                                    className="downvote"
                                                    onClick={this.valueDecrease}
                                                    value={index}>Hate
                                                </button>
                                            </div>
                                            
                                            
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        
                    )
                })}
            </div>
            
        )
    }
}

export default Main