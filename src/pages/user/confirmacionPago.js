import React, {useEffect, useState} from 'react'
import { useTheme } from '@emotion/react'
import { Box, Typography, Grid, CircularProgress, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { useAuthContext } from 'src/hooks/useAuthContext';
import useUpdateUserDoc from 'src/hooks/useUpdateDocUser';
import Link from 'next/link';

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);

export default function ConfirmacionPago() {

  const [resData, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState()
  const [subscription, setSubscription] = useState()

  const router = useRouter()

  const payment = router.query

  const {user, data} = useAuthContext()
  const {updateUserDoc} = useUpdateUserDoc()

  const theme = useTheme()

  useEffect(() => {

      if (payment){
        setIsLoading(true)
        fetch("../api/retrieve-setup-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              items: { 
              paymentId: payment.setup_intent
              }
          }),
        })
          .then((res) => res.json())
          .then(async(data) => {
          await setData(data)
          console.log(data)
        });
      }

      

  }, [payment])

  useEffect(() => {
    subscription && console.log(subscription.id)
    console.log(data.subscriptionId)
    subscription && updateUserDoc(user, subscription.id).then(setIsLoading(false))
  }, [subscription])
  

  useEffect(() => {
    if (resData && resData.status === 'succeeded' && !subscription){
      if (!data.subscriptionId){
        fetch("../api/create-stripe-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            items: { 
            customer: resData.customer,
            price: resData.metadata.subscriptionId,
            payment_method: resData.payment_method
            }
        }),
      })
        .then((res) => res.json())
        .then(async(data) => {
        await setSubscription(data)
        setMessage("Tu forma de pago es válida")  
      });
      } else {
        setMessage("Tu membresia ha sido activada")
      }
      
   
    } else if ( resData && resData.status === 'requires_payment_method') {
      setIsLoading(false)
      setMessage("Ha habido un problema para procesar su pago.");
    } else if (resData && resData.status === 'requires_action'){
      setIsLoading(false)
      setMessage ("Favor de completar tu pago en una tienda Oxxo")
    }
  }, [resData])
  
  

  return (
    <Box>
      <Grid container sx={{minHeight: '100vh', paddingY: '15vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'neutral.900', color: 'white', textAlign: 'center'}}>
      <Typography variant="h3">
      {message ? 
      <>
        <Typography variant="h3">{message}</Typography>
        <Link href={'/user'}><Button variant='contained'>Ir a Dashboard</Button></Link>
      </>
      : <CircularProgress color='inherit' />}
      {data && data.status === 'succeeded' && <Typography>Tu Plan: {data.metadata.plan} </Typography>}
      {data && data.amount && <Typography>Monto: {data.amount/100} </Typography>}
      </Typography>
      </Grid>
    </Box>
  )
}