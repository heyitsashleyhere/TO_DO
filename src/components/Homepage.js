import React, { useEffect, useRef, useState } from 'react';
// firebase
import { signOut } from "firebase/auth";
import { auth, db } from '../firebase.js';
import { set, ref, onValue, remove, update } from 'firebase/database'
// router
import { useNavigate } from 'react-router-dom'
// uuid
import { v4 as uuidv4 } from 'uuid';
// Chakra
import { 
  Input, Checkbox,
  IconButton, Button, ButtonGroup,
  Flex, Spacer,
  Table, Tbody, Tr, Td, TableContainer,
  Heading, Select, Text,
  Modal, ModalOverlay, ModalContent, useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, InfoOutlineIcon } from '@chakra-ui/icons'
// component
import About from './About.js';

// CRUD

export default function Homepage() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editedTodo, setEditedTodo] = useState("");
  const navigate = useNavigate();

  const checkboxRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      // READ
      if(user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), snapshot => {
          setTodos([]); // Every time it will reset to NOT re-add the old value
          const data = snapshot.val(); 
          if (data !== null){
            Object.values(data).map(todo => setTodos(oldArray => [...oldArray, todo]))
            
          }
        })
      } else if(!user) {
        navigate('/') 
      }
    })
  }, [newTodo, navigate])
  
  function handleLogout() {
    signOut(auth)
      .then(() =>{ navigate('/') })
      .catch(err => alert(err.message))
  }

  function convertUNIXtimestamp(string) {
    const unix_timestamp = parseInt(string)
    const timestamp = new Date(unix_timestamp).toLocaleString()
    return timestamp
  }

  // CREATE
  function writeToDatabase() {
    const created = (Date.now()).toString() // to get the correct unix_timestamp
    const todoId = uuidv4();
    set(ref(db, `/${auth.currentUser.uid}/${todoId}`), {
      todo: newTodo,
      todoId: todoId,
      completion: false,
      created: created
    })
    // clear the input
    setNewTodo("")
  }
  // READ -- in useEffect
  // UPDATE
  function handleUpdate(todoId) {
    setEditItem(todoId)
  }
  function handleConfirm(td) {
    update(ref(db, `${auth.currentUser.uid}/${td.todoId}`), {
      todo: editedTodo,
      todoId: td.todoId,
      completion: td.completion
    })
    setEditItem(null)
  }

  function handleCheckbox(td) {
    if(checkboxRef.current.checked === true) {
      update(ref(db, `${auth.currentUser.uid}/${td.todoId}`), {
        todo: td.todo,
        todoId: td.todoId,
        completion: true
      })
    } else if (checkboxRef.current.checked === false) {
      update(ref(db, `${auth.currentUser.uid}/${td.todoId}`), {
        todo: td.todo,
        todoId: td.todoId,
        completion: false
      })
    }
  }
  // DELETE
  function handleDelete(todoId) {
    remove(ref(db, `${auth.currentUser.uid}/${todoId}`))
  }
  
  // SORT
  function handleSelectSort(e) {
    // Best is to filter from the backend, check if firebase can do the sorting
    // save my filters in a state and chain it in todos
    const expr = e.target.value;
    onValue(ref(db, `/${auth.currentUser.uid}`), snapshot => {
      const data = snapshot.val(); 
      const dataObj = Object.values(data)
      switch (expr) {
        case 'incomplete':
          setTodos(dataObj.filter(x => x.completion === false))
          break
        case 'completed':
          setTodos(dataObj.filter(x => x.completion === true))
          break
        case 'newest':
          setTodos(dataObj.sort((a, b) => b.created - a.created))
          break
        case 'oldest':
          setTodos(dataObj.sort((a, b) => a.created - b.created))
          break
        default:
          setTodos(dataObj)
      }
    })
  }

  function handleKeyDown(e) {
    if(e.key === "Enter") {
      writeToDatabase()
    }
  }

  return (
    <div className='Homepage'>
      <Flex my={6} mx={50}>
        <Input type="text"
               width="60%"
               value={ newTodo }
               onChange={ (e)=>setNewTodo(e.target.value) }
               onKeyDown={handleKeyDown}
               placeholder="I need to do..."
               name="newTodo" id="newTodo" />
        <IconButton icon={<AddIcon />} onClick={writeToDatabase}>add</IconButton>
        <Spacer />
        <ButtonGroup isAttached variant='outline'>
          <Button mr='-px' onClick={handleLogout}>Logout</Button>
          <IconButton aria-label='About' icon={<InfoOutlineIcon />} onClick={onOpen} />

          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <ModalContent>
              <About />
            </ModalContent>
          </Modal>
        </ButtonGroup>
      </Flex>

      <Flex minWidth='max-content' alignItems='center' gap='2' mx={50}>
        <Heading>💩 TO GET DONE:</Heading>
        <Spacer />
        <Select placeholder='Sort by...' className='sort-select' width="40%" onChange={handleSelectSort} >
          <option value='incomplete'>Incomplete</option>
          <option value='completed'>Completed</option>
          <option value='newest'>Newest</option>
          <option value='oldest'>Oldest</option>
        </Select>
      </Flex>

      <TableContainer mx={50}>
        <Table variant='striped' colorScheme='gray'>
            <Tbody>
            {
              todos.map(td => 
                (
                  <Tr className="todo-wrapper" key={td.todoId}>
                    <Td>
                      {td.completion ? 
                      <Checkbox ref={checkboxRef} defaultChecked onChange={() => handleCheckbox(td)}/>
                      :
                      <Checkbox ref={checkboxRef} onChange={() => handleCheckbox(td)}/>
                      }
                    </Td>
                      {
                        td.todoId === editItem ?
                        <Td>
                            <Input defaultValue={td.todo}
                                   onChange={ (e)=>setEditedTodo(e.target.value) } />
                        </Td>
                        :
                        <Td>
                            <p style={td.completion ? {textDecoration: 'line-through'} : null}>{td.todo}</p>
                            <Text fontSize='xs'>{convertUNIXtimestamp(td.created)}</Text>
                        </Td>
                      }

                      {
                        td.todoId === editItem ?
                        <Td>
                            <IconButton icon={<CheckIcon />} onClick={() => handleConfirm(td)} />
                        </Td>
                        :
                        <Td>
                            <IconButton onClick={() => handleUpdate(td.todoId)} icon={<EditIcon />} />
                        </Td>
                      }

                    <Td>
                      <IconButton onClick={() => handleDelete(td.todoId)} icon={<DeleteIcon />} />
                    </Td>
                  </Tr>
                  
                )
              )
            }
            </Tbody>
        </Table>
      </TableContainer> 
    </div>
  )
}

// rfc: react function component