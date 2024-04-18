import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';


export default function Register() {

  const navigate = useNavigate();
    const { register, handleSubmit,setError, formState: {  errors, isValid } } = useForm({
        mode: 'all'
    });

    function handleApiErrors(errors: any) {
        if(errors) {
            Array.from(errors).forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error });
                } else if (error.includes('Email')) {
                  setError('email', { message: error });
                  console.log({ message: error });
                } else if (error.includes('Username')) {
                    setError('usename', { message: error});
                }
            });
        }
    }


  return (
          <Container component={Paper} maxWidth="sm"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
  
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" 
                  onSubmit={handleSubmit(data => agent.Account.register(data)
                    .then(() => {
                      toast.success('Registeration successful - you can now login');
                      navigate('/login'); 
                    })
                    .catch(error => handleApiErrors(error)))} 
            noValidate sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth 
              required
              label="Username"
              autoFocus 
            {...register('username', {
              required: 'Username is required',
            })}
              error={!!errors.username}
              helperText={errors?.username?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth 
              required
              label="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                message: 'Not a valid email address'
              }
            })}
              error={!!errors.email}
              helperText={errors?.email?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              label="Password"
              type="password"
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: 'Password does not match the complexity requirement'
                
              }
            })}
              error={!!errors.password}
              helperText={errors?.password?.message as string}
            />
           
            <Button 
              type="submit"
              disabled ={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link to='/login'>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>

      </Container>
  );
}