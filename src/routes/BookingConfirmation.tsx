import React from 'react';

import { Container, Paper, Title, Text, Button } from '@mantine/core';

import { useNavigate, useLocation } from 'react-router-dom';

import dayjs from 'dayjs';

import 'dayjs/locale/da'; // Import Danish locale

import supabase from '../supabase/getSupabaseClient';

import logo from '../images/logo.svg'; // Import the logo

import background from '../images/Background.svg'; // Page-wide background image

import kvittering from '../images/kvittering-2.svg'; // Receipt image


const BookingConfirmation = () => {

 const navigate = useNavigate();

 const location = useLocation();

 const { room, date, time, plan, capacity } = location.state || {};


 const handleConfirmBooking = async () => {

   try {

     if (!date || !time || !room) {

       console.error('Missing required fields:', { date, time, room });

       throw new Error('Alle felter skal udfyldes.');

     }


     const [startTimeStr, endTimeStr] = time.split('-');

     if (!startTimeStr || !endTimeStr) {

       console.error('Invalid time format:', time);

       throw new Error(

         'Tidspunktet er ikke korrekt formateret. Forventet format: HH:MM-HH:MM'

       );

     }


     const parsedDate = dayjs(date, 'YYYY-MM-DD');

     if (!parsedDate.isValid()) {

       console.error('Invalid date:', date);

       throw new Error('Datoen er ugyldig. Sørg for at vælge en gyldig dato.');

     }


     const startTime = parsedDate

       .hour(Number(startTimeStr.split(':')[0]))

       .minute(Number(startTimeStr.split(':')[1]))

       .second(0);


     const endTime = parsedDate

       .hour(Number(endTimeStr.split(':')[0]))

       .minute(Number(endTimeStr.split(':')[1]))

       .second(0);


     if (!startTime.isValid() || !endTime.isValid()) {

       console.error('Invalid start or end time:', { startTime, endTime });

       throw new Error('Ugyldige dato- eller tidsværdier.');

     }


     const { data: sessionData, error: sessionError } =

       await supabase.auth.getSession();

     if (sessionError) {

       console.error('Session error:', sessionError);

       throw new Error(

         'Kunne ikke hente brugerens session. Log venligst ind igen.'

       );

     }


     const userId = sessionData?.session?.user?.id;

     if (!userId) {

       console.error('User ID not found in session.');

       throw new Error('Bruger ikke fundet. Log venligst ind igen.');

     }


     const { error: insertError } = await supabase.from('bookings').insert([

       {

         lokale_id: room,

         user_id: userId,

         start_time: startTime.toISOString(),

         end_time: endTime.toISOString(),

       },

     ]);


     if (insertError) {

       console.error('Error inserting booking:', insertError);

       throw new Error('Der opstod en fejl ved oprettelse af bookingen.');

     }


     alert('Booking bekræftet!');

     navigate('/BookingSuccess');

   } catch (error: any) {

     console.error('Error in handleConfirmBooking:', error.message);

     alert(error.message || 'Der opstod en fejl.');

   }

 };


 return (

   <div

     style={{

       backgroundImage: `url(${background})`,

       backgroundSize: 'cover',

       backgroundRepeat: 'no-repeat',

       backgroundPosition: 'center',

       minHeight: '110vh',

       display: 'flex',

       flexDirection: 'column',

     }}

   >

     {/* Header */}

     <header

       style={{

         display: 'flex',

         alignItems: 'center',

         justifyContent: 'space-between',

         backgroundColor: '#343a40',

         padding: '0.5rem 1rem',

         borderBottom: '1px solid #495057',

         position: 'fixed',

         top: 0,

         left: 0,

         right: 0,

         zIndex: 1000,

       }}

     >

       <div style={{ display: 'flex', alignItems: 'center' }}>

         <img

           src={logo}

           alt="Logo"

           style={{

             width: '150px',

             height: '60px',

             objectFit: 'contain',

           }}

         />

       </div>

     </header>


     {/* Booking Confirmation Content */}

     <Container

       size="sm"

       style={{

         marginTop: '80px',

         display: 'flex',

         alignItems: 'center',

         justifyContent: 'center',

       }}

     >

       <div

         style={{

           backgroundImage: `url(${kvittering})`,

           backgroundSize: 'contain',

           backgroundRepeat: 'no-repeat',

           backgroundPosition: 'center',

           width: '100%',

           maxWidth: '500px',

           padding: '4rem 2rem',

           position: 'relative',

         }}

       >

         <Paper

           style={{

             padding: '1rem',

             textAlign: 'center',

             backgroundColor: 'transparent',

             boxShadow: 'none',

           }}

         >

           <Title

             order={2}

             style={{

               marginBottom: '1rem',

               fontWeight: 300, // Lighter font weight

               fontSize: '2rem', // Further increased font size

               lineHeight: '1.5', // Adjust line height for better vertical spacing

               letterSpacing: '0.05rem', // Adds space between letters

               wordSpacing: '0.2rem', // Adds space between words

               textAlign: 'center', // Keeps text centered

               marginTop: '-3rem', // Moves the text higher

             }}

           >

             DINE BOOKING-

             <br />

             OPLYSNINGER

           </Title>

           <Text

             style={{

               marginBottom: '0.5rem', // Reduce bottom margin to bring the texts closer

               color: 'gray', // Match the color of the bottom text

             }}

           >

             Lokale booket i Cphbusiness Lyngby

           </Text>

           <Text

             style={{

               marginBottom: '2rem',

               color: 'gray', // Match the same color

               borderBottom: '1px solid gray', // Add a line under the text

               paddingBottom: '0.5rem', // Add padding for spacing between text and the line

             }}

           >

             Adresse: Firskovvej 18, 2800 Kongens Lyngby

           </Text>

           <Title

             order={5}

             style={{

               marginBottom: '1rem',

               color: 'gray', // Match the gray color

               fontWeight: 400, // Make it less bold to align with the text style

               fontSize: '1rem', // Adjust font size to match

               borderBottom: '1px solid gray', // Add a line under the text

               paddingBottom: '0.5rem', // Add spacing between the text and the line

               width: '80%', // Slightly shorter line than the default (adjust as needed)

               textAlign: 'center', // Center the line under the text

               margin: '0 auto', // Center alignment for reduced width

             }}

           >

             Lokale booket til:

           </Title>

           <Text>

             {date && dayjs(date).isValid()

               ? dayjs(date)

                   .format('dddd [d.] D MMMM') // Format to 'mandag d. 13 November'

                   .charAt(0)

                   .toUpperCase() +

                 dayjs(date).format('dddd [d.] D MMMM').slice(1)

               : 'Ingen valgt'}

           </Text>


           <Text>

             {time

               ? `Klokken ${Array.isArray(time) ? time.join(' + ') : time}`

               : 'Ingen valgt'}

           </Text>


           <Title

             order={5}

             style={{

               margin: '2rem 0 1rem', // Keep existing spacing

               color: 'gray', // Match the gray color

               fontWeight: 400, // Align with the previous text style

               fontSize: '1rem', // Adjust font size to match

               borderBottom: '1px solid gray', // Add a line under the text

               paddingBottom: '0.5rem', // Add spacing between the text and the line

               width: '80%', // Adjust line width to align with previous lines

               textAlign: 'center', // Center the text and line

               margin: '2rem auto 1rem', // Ensure proper vertical and horizontal centering

             }}

           >

             Information om lokale:

           </Title>

           <Text

             style={{

               display: 'flex',

               alignItems: 'center',

             }}

           >

             <span>Etage:</span>

             <span

               style={{

                 flex: 1,

                 borderBottom: '1px dotted gray', // Dotted line

                 margin: '0 0.5rem', // Space between text and dotted line

               }}

             ></span>

             <span>{plan || 'Ingen valgt'}</span>

           </Text>

           <Text

             style={{

               display: 'flex',

               alignItems: 'center',

             }}

           >

             <span>Lokale:</span>

             <span

               style={{

                 flex: 1,

                 borderBottom: '1px dotted gray', // Dotted line

                 margin: '0 0.5rem', // Space between text and dotted line

               }}

             ></span>

             <span>{room || 'Ingen valgt'}</span>

           </Text>

           <Text

             style={{

               display: 'flex',

               alignItems: 'center',

             }}

           >

             <span>Størrelse:</span>

             <span

               style={{

                 flex: 1,

                 borderBottom: '1px dotted gray', // Dotted line

                 margin: '0 0.5rem', // Space between text and dotted line

               }}

             ></span>

             <span>{capacity || 'Ingen valgt'} personer</span>

           </Text>

           <Text

             style={{

               marginTop: '1.5rem',

               marginBottom: '2rem',

               fontSize: '0.875rem',

               color: 'gray',

             }}

           >

             Der bliver sendt en bekræftelsesmail til din studie mail. Hvis der

             ønskes at annullere bookingen, gør du det via mailen.

           </Text>

           <div

             style={{

               display: 'flex',

               flexDirection: 'column',

               alignItems: 'center',

               gap: '1rem', // Increase the gap between the buttons

             }}

           >

             <Button

               variant="filled"

               color="violet"

               size="lg"

               radius="xs"

               onClick={() => navigate('/BookingSuccess')} // Navigate to the confirmation page

             >

               BOOK NU

             </Button>

             <button

               onClick={() => navigate(-1)} // Navigate to the previous page

               style={{

                 all: 'unset', // Resets default button styles

                 display: 'block',

                 width: '130px', // Match BOOK NU button width

                 textAlign: 'center',

                 cursor: 'pointer', // Ensure the cursor changes to a pointer

                 marginTop: '1rem', // Add additional space if needed

               }}

             >

               <span

                 style={{

                   color: 'gray', // Set text color to gray

                   fontSize: '1rem', // Consistent text size

                   position: 'relative', // Allow adjustment

                   top: '-1px', // Move the text slightly higher over the line

                 }}

               >

                 Tilbage

               </span>

               <div

                 style={{

                   width: '100%', // Full width of the button

                   height: '1px', // Thin underline

                   backgroundColor: 'gray', // Gray color for underline

                   marginTop: '4px', // Space between the text and the line

                 }}

               ></div>

             </button>

           </div>

         </Paper>

       </div>

     </Container>

   </div>

 );

};


export default BookingConfirmation;