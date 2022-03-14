import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import useUpdateUser from 'src/hooks/useUpdateUser';




export const AccountProfileDetails = (props) => {


  const {error, isPending, updateUser} = useUpdateUser()


  

  const formik = useFormik({
    initialValues: {
      email: props.user.email,
      displayName: props.user.displayName,
      phoneNumber: props.user.phoneNumber
    },
    enableReinitialize:true, 
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Introducir un email válido')
        .max(255)
        .required(
          'Introduce una dirección de email'),
      displayName: Yup
        .string()
        .max(255)
        .required(
          'Se requiere escribir el nombre'),
      phoneNumber: Yup
        .number()
        .nullable()
    }),
    onSubmit: (values, {setSubmitting}) => {
        console.log(values.displayName, values.email, values.phoneNumber)
        updateUser(props.user, values.displayName, values.email, values.phoneNumber).then(setSubmitting(false))
      }
  });

  

  return (
    <>
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Card>
        <CardHeader
          subheader="Aqui puedes actualizar tu información"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              
              xs={12}
            >
              <TextField
              error={Boolean(formik.touched.firstName && formik.errors.firstName)}
              fullWidth
              helperText={formik.touched.firstName && formik.errors.firstName}
              label="Nombre"
              margin="normal"
              name="displayName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.displayName}
              variant="outlined"
            />
            </Grid> 
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Dirección de Email"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                fullWidth
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                label="Número Telefónico"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                
                value={formik.values.phoneNumber}
                variant="outlined"
              />
            </Grid>
           
            
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            size="large"
            type="submit"
            variant="contained"
          >
            Guardar Detalles
          </Button>
        </Box>
        
      </Card>
    </form>
      <Box>
      {error && <Typography>{error}</Typography>}
      </Box>
      </>
  );
};
