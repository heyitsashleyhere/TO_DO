import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button, Link
  } from '@chakra-ui/react'
import { FaTwitter } from 'react-icons/fa';
import { GoMarkGithub } from 'react-icons/go';

export default function About() {
    const { onClose } = useDisclosure()

    return (
        <ModalContent>
            <ModalHeader>About</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <p>This is a CRUD project for <Link href='https://reactjs.org/' color='pink.500' isExternal>Ashley</Link> to practice using <Link href='https://reactjs.org/' color='blue.500' isExternal>React</Link> and learn about <Link href='https://firebase.google.com/' color='blue.500' isExternal>Firebase Realtime Database</Link> and <Link href='https://chakra-ui.com/' color='blue.500' isExternal>Chakra</Link>.</p>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='github' leftIcon={<GoMarkGithub />} isExternal><a href="https://github.com/heyitsashleyhere" target="_blank" rel="noreferrer">Github</a></Button>
                
                <Button colorScheme='twitter' leftIcon={<FaTwitter />} ><a href="https://twitter.com/ashhhleyhere" target="_blank" rel="noreferrer">Twitter</a></Button>
            </ModalFooter>
        </ModalContent>
    )
}
