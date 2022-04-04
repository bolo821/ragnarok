import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Sidebar from './adminSidebar';
import { styled } from '@mui/system';
import { AdminLayout, AdminBody, AdminMainBody, formstyle, AuthButton, AdminTextField } from '../../components/adminlayout/LayoutItem';
import { toast } from 'react-toastify';
import { setMailServer } from '../../actions/mailserver';

const DashboardBody = styled(Box)(({ theme }) => ({
    padding: '26px',
    paddingBottom: '0',
    color: '#F5F6F9',
    height: 'calc(100% - 50px)',
}));

function MailServer() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validate = () => {
    return formData.host !== '' && formData.port !== '' && formData.username !== '' && formData.password !== '';
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn('Please fill all fields.');
    } else {
      dispatch(setMailServer(formData));
    }
  };

  return (
    <AdminLayout>
        <AdminBody direction='row'>
            <Sidebar />
            <AdminMainBody>
                <DashboardBody justifyContent='center'>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                        >
                            <Box sx={formstyle}>
                                <Typography id="keep-mounted-modal-title" variant="h5" color='#000'>
                                Set your mail server.
                                </Typography>
                                <Grid container sx={{ mb: 2 }}>
                                </Grid>

                                <form onSubmit={onSubmit}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <AdminTextField fullWidth label="Host" size='small' type="text" name="host" value={formData.host} onChange={onChange} />
                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <AdminTextField fullWidth label="Port" size='small' name="port" type="number" value={formData.port} onChange={onChange} />
                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <AdminTextField fullWidth label="Username" size='small' type='text' name="username" value={formData.username} onChange={onChange} />
                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <AdminTextField fullWidth label="Password" size='small' type='password' name="password" value={formData.password} onChange={onChange} />
                                        </Grid>
                                        <Stack alignItems={{ xs: 'center', width: '100%' }}>
                                            <AuthButton type='submit' fullWidth>
                                                Set
                                            </AuthButton>
                                        </Stack>
                                    </Grid>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </DashboardBody>
            </AdminMainBody>
        </AdminBody>
    </AdminLayout>
  );
}

export default MailServer;