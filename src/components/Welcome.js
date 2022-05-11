import React, { useEffect, useState } from 'react'
// firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
// router
import { useNavigate } from 'react-router-dom'
// Chakra
import { Heading, Stack, Center,
        Input, InputGroup, InputLeftElement, 
        Button, Link, 
        Alert, AlertTitle, AlertDescription, AlertIcon
      } from '@chakra-ui/react'
import { EmailIcon, LockIcon } from '@chakra-ui/icons'

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  })

  const navigate = useNavigate();

  useEffect(()=> {
    auth.onAuthStateChanged((user) => {
      if(user) {
        navigate('/homepage') 
      }
    })
  })

  function handleEmailChange(e) {
    if((e.target.value))
    setEmail(e.target.value)
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => { navigate('/homepage') })
      .catch((err) => {setErrorMsg("Invalid Login"); console.log(err.message)})
  }

  function handleRegister() {
    if(registerInformation.email !== registerInformation.confirmEmail){
      setErrorMsg("Please confirm that emails are the same")
      return
    } else if (registerInformation.password !== registerInformation.confirmPassword){
      setErrorMsg("Please confirm that passwords are the same")
      return
    }
    createUserWithEmailAndPassword(auth, registerInformation.email, registerInformation.password)
      .then(() => { navigate("/homepage") })
      .catch((err) => {
          if(err.message === "Firebase: Error (auth/invalid-email).") {
            setErrorMsg("Please make sure your email is a valid email")
            console.log(err.message)
          } else if (err.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
            setErrorMsg("Please make sure your password is at least 6 characters")
            console.log(err.message)
          }
        })
    setErrorMsg("")
  }

  return (
    <div className='Welcome'>
      <Center>
        <Heading mt={4} mb={8}>✍️ ToDo</Heading>
      </Center>
      
      <div className='login-register-container'>
        {isRegistering ? 
        <Center>
          <Stack spacing={3} maxW='md'>
            <InputGroup>
              <Input type="email"
                     onChange={(e) => setRegisterInformation({...registerInformation, email: e.target.value})}
                     placeholder="Email"
                     value={registerInformation.email} />
            </InputGroup>

            <InputGroup>
              <Input type="email"
                     onChange={(e) => setRegisterInformation({...registerInformation, confirmEmail: e.target.value})}
                     placeholder="Confirm Email"
                     value={registerInformation.confirmEmail} />
            </InputGroup>

            <InputGroup>
              <Input type="password"
                     onChange={(e) => setRegisterInformation({...registerInformation, password: e.target.value})}
                     placeholder="Password"
                     value={registerInformation.password} />
            </InputGroup>

            <InputGroup>
              <Input type="password"
                      onChange={(e) => setRegisterInformation({...registerInformation, confirmPassword: e.target.value})}
                      placeholder="Confirm password"
                      value={registerInformation.confirmPassword} />
            </InputGroup>

            {errorMsg ?
              <Alert status='error'>
                <AlertIcon />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
              :
              null
            }

            <Button onClick={handleRegister}>Register</Button>
            <Button onClick={() => { setIsRegistering(false) }}
                    colorScheme='yellow'>Back to Login</Button>
          </Stack>
        </Center>
        :
        <Center>
          <Stack spacing={3} maxW='md'>
            <InputGroup>
              <InputLeftElement pointerEvents='none'
                                children={<EmailIcon color='gray.300' />} />
              <Input type="email"
                     onChange={handleEmailChange}
                     value={email}
                     placeholder="email"
                     id="emailInput" />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents='none'
                                children={<LockIcon color='gray.300' />} />
              <Input type="password"
                     onChange={handlePasswordChange}
                     value={password}
                     placeholder="password"
                     id="passwordInput" />
            </InputGroup>

            {errorMsg === "Invalid Login" ?
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>{errorMsg}</AlertTitle>
              </Alert>
              :
              null
            }

            <Button onClick={handleLogin} disabled={email && password ? false : true}>Login</Button>
            <Center>
              <Link onClick={() => { setIsRegistering(true); setErrorMsg("") }}>Create an account</Link>
            </Center>
          </Stack>

        </Center>

        }

      </div>
    </div>
  )
}
