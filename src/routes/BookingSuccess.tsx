import React from 'react';

import { Button, Title } from '@mantine/core';

import { useNavigate } from 'react-router-dom';


const BookingSuccess = () => {

 const navigate = useNavigate();


 return (

   <div

     style={{

       display: 'flex',

       flexDirection: 'column',

       alignItems: 'center',

       justifyContent: 'center',

       minHeight: '100vh',

       backgroundColor: '#212529',

       color: '#fff',

     }}

   >

     <div

       style={{

         backgroundColor: '#845EF7',

         borderRadius: '50%',

         width: '6rem',

         height: '6rem',

         display: 'flex',

         alignItems: 'center',

         justifyContent: 'center',

         marginBottom: '1rem',

       }}

     >

       <svg

         xmlns="http://www.w3.org/2000/svg"

         width="48"

         height="48"

         fill="white"

         viewBox="0 0 24 24"

       >

         <path d="M20.285 6.708l-11.813 11.793-5.261-5.232 1.418-1.414 3.843 3.822 10.395-10.374 1.418 1.405z" />

       </svg>

     </div>

     <Title

       order={2}

       style={{

         fontSize: '2rem', // Larger size

         fontWeight: 300, // Lighter font weight

         marginBottom: '3rem', // Spacing below the text

       }}

     >

       Dit lokale er nu booket

     </Title>

     <div

       style={{

         display: 'flex',

         flexDirection: 'column',

         alignItems: 'center',

         gap: '1rem', // Add spacing between buttons

         marginTop: '2rem', // Add space between text and buttons

       }}

     >

       <Button

         variant="filled"

         color="violet"

         radius="xs"

         onClick={() => window.open('https://mail.google.com', '_blank')}

       >

         Før mig til min mail

       </Button>

       <Button

         onClick={() => navigate('/')}

         variant="outline"

         style={{

           color: '#fff',

           borderColor: '#fff',

         }}

       >

         Log mig af

       </Button>

       <button

         onClick={() => navigate('/LokaleOversigt')}

         style={{

           all: 'unset', // Reset default button styles

           color: 'gray', // Set text color to gray

           textDecoration: 'underline', // Add underline

           fontSize: '1rem', // Keep text size consistent

           cursor: 'pointer', // Pointer cursor for interactivity

         }}

       >

         Til Lokaleoversigt

       </button>

     </div>

   </div>

 );

};


export default BookingSuccess;