import React from 'react';
import { createRoot } from 'react-dom/client';
// import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import App from './App';
import './index.css';


const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </React.StrictMode>
    
);

