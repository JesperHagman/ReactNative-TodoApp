import {
    View, 
    Text,
    FlatList, 
    StyleSheet, 
    Pressable, 
    TextInput, 
    TouchableOpacity, 
    Keyboard } 
    from 'react-native'
    
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [doing, setDoing] = useState([]);
    const [done, setDone] = useState([]);
    const [addData, setAddData] = useState('');
    const [userInput, setUserInput] = useState("");
    const taskRef = firebase.firestore().collection('tasks');
    const doingRef = firebase.firestore().collection('doing');
    const doneRef = firebase.firestore().collection('done');

    const renderTasks = () => {
        taskRef
        .orderBy('createdAt', 'desc')
        .onSnapshot( 
            querySnapshot => {
            const todos = []
            querySnapshot.forEach((doc) => {
                const {heading} = doc.data()
                todos.push({
                    id: doc.id,
                    heading,
                })
            })
            setTodos(todos)
        })
    }

    const filteredData = userInput
    ? todos.filter((item) =>
        item.heading.toLowerCase().includes(userInput.toLowerCase())
    )
    : todos; 

    const renderDoing = () => {
        doingRef
        .orderBy('createdAt', 'desc')
        .onSnapshot( 
            querySnapshot => {
            const doing = []
            querySnapshot.forEach((doc) => {
                const {heading} = doc.data()
                doing.push({
                    id: doc.id,
                    heading,
                })
            })
            setDoing(doing)
            //console.log(users)
        })
    }
    const renderDone = () => {
        doneRef
        .orderBy('createdAt', 'desc')
        .onSnapshot( 
            querySnapshot => {
            const done = []
            querySnapshot.forEach((doc) => {
                const {heading} = doc.data()
                done.push({
                    id: doc.id,
                    heading,
                })
            })
            setDone(done)
            //console.log(users)
        })
    }

    useEffect(() => {
        renderTasks()
        renderDoing()
        renderDone()
    }, [])
    
    const deleteTodo = (done) => {
        doneRef
            .doc(done.id)
            .delete()
            .then(() => {
                
            })
            .catch(error => {
                // show an error alert
                alert(error);
            })
    }
    const addToDoing = (todos) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            heading: todos.heading,
            createdAt: timestamp
        }
        doingRef
        .add(data)
        .catch((error) => {
            alert(error);
        })
        taskRef
            .doc(todos.id)
            .delete()
            .catch(error => {
                alert(error);
        })
    }
    const addToDone = (doing) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            heading: doing.heading,
            createdAt: timestamp
        }
        doneRef
        .add(data)
        .then(() => {
            // release todo state
            setAddData('');
            // release keyboard
            Keyboard.dismiss();
        })
        .catch((error) => {
            // show an alert in case of error
            alert(error);
        })
        doingRef
            .doc(doing.id)
            .delete()
            .then(() => {                
                
            })
           .catch(error => {

            alert(error);
        })
    }
    const addTodo = () => {
        if (addData && addData.length > 0) {
            // get the timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                createdAt: timestamp
            };
            taskRef
                .add(data)
                .then(() => {
                    setAddData('');
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }
       
   
    return (
        <View style={styles.flex}>
            <View style={styles.formContainer}>

                <TextInput  //Search
                    style={styles.input}
                    onChangeText={setUserInput}
                    value={userInput}
                    placeholderTextColor="#aaa"
                    placeholder="Search"
                />

                <TextInput // Add to task
                    style={styles.input}
                    placeholder='Add new todo'
                    value={addData}
                    placeholderTextColor="#aaa"
                    onChangeText={(heading) => setAddData(heading)}  
                />
                
                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.column}>
                <View style={styles.flex}>
                    <Text>Today's tasks</Text>

                    <FlatList
                        data={filteredData}
                        renderItem={({item}) => (
                            <View>
                                <Pressable style={styles.container} onPress={() => addToDoing(item)}>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.itemHeading}>
                                                {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                        </Text>
                                    </View> 
                                </Pressable>
                            </View>
                        )}/>
                </View>

                <View style={styles.flex}>
                    <Text>Doing</Text>
                        <FlatList
                            data={doing}
                            renderItem={({item}) => (
                                <View>
                                    <Pressable style={styles.container} onPress={() => addToDone(item)}>
                                        <View style={styles.innerContainer}>
                                            <Text style={styles.itemHeading}>
                                                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                            </Text>
                                        </View>          
                                    </Pressable>
                                </View>
                        )}/>   
                </View>

                <View style={styles.flex}>
                    <Text>Done</Text>
                        <FlatList
                            data={done}
                            renderItem={({item}) => (
                                <View>
                                    <Pressable style={styles.container} onPress={() => deleteTodo(item)}>
                                        <View style={styles.innerContainer}>
                                            <Text style={styles.itemHeading}>
                                                {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                            </Text>
                                        </View>       
                                </Pressable>
                            </View>
                        )}/>   
                        
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e5e5',
        padding: 2,
        borderRadius: 15,
        margin:5,
        flexDirection:'row',
        alignItems:'center'
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft:30,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize:15,
        marginRight:22
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginLeft:10,
        marginRight: 10,
        marginTop:100
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    column:{
        flexDirection:'row',
        justifyContent: "space-between",
    },
    flex:{
        flex:1,
    }
});

export default Home