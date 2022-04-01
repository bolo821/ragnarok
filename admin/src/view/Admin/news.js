import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { addNews } from '../../actions/news';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import { getNews, deleteNews } from '../../actions/news';
import { AuthButton, AdminTextField } from '../../components/adminlayout/LayoutItem';
import { Input } from '@mui/material';

const DashboardBody = styled(Box)(({ theme }) => ({
  padding: '26px',
  paddingBottom: '0',
  color: '#F5F6F9',
  height: 'calc(100% - 50px)',
}));

const ImageContainer = styled(Stack)(({ theme }) => ({
  margin: '2rem 0',
}));

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const NewButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  height: '30px',
  backgroundColor: '#1c4f9c',
  color: 'white',
  fontWeight: 600
}));

export const FileInput = styled(Input)(({ theme }) => ({
  margin: '10px 0',
  borderRadius: '5px',
  '& span': {
    color: 'black'
  },
  '& input': {
    color: 'black'
  },
  '& label': {
    color: '#777'
  },
  '& fieldset': {
    border: '1px solid #999',
    color: 'black'
  }
}));

function News() {
  const dispatch = useDispatch();
  const news = useSelector(state => state.news.news);

  const [ image, setImage ] = useState('');
  const [ link, setLink ] = useState('');
  const [ id, setId ] = useState('');
  const [ displayData, setDisplayData ] = useState([]);

  const [ showModal, setShowModal ] = useState(false);
  const [ showEditModal, setShowEditModal ] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  }
  const handleOpenModal = () => {
    setShowModal(true);
  }
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  }
  const handleOpenEditModal = () => {
    setShowEditModal(true);
  }

  useEffect(() => {
    dispatch(getNews());
  }, [ dispatch ]);

  useEffect(() => {
    let newData = [];
    let temp = [];
    for (let i=0; i<news.length; i++) {
      if (i % 3 === 0 && i > 0) {
        newData = [ ...newData, temp ];
        temp = [];
      }
      temp.push(news[i]);
    }
    if (temp.length) newData = [ ...newData, temp ]
    setDisplayData(newData);
  }, [ news ]);

  const handleSubmit = e => {
    e.preventDefault();

    if (validate()) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('link', link);
      dispatch(addNews(formData));
      handleCloseModal();
      setImage(null);
      setLink('');
    }
  }

  const validate = () => {
    return image && link !== '';
  }

  const handleImageChange = ele => {
    setImage(ele.path);
    setLink(ele.link);
    setId(ele.id);
    handleOpenEditModal();
  }
  
  const handleRemove = () => {
    dispatch(deleteNews(id));
    handleCloseEditModal();
  }

  return (
    <>
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
                  <Stack direction='row' alignItems={{xs: 'center'}}>
                    <NewButton onClick={handleOpenModal}>Add News</NewButton>
                  </Stack>

                  <ImageContainer>
                    { displayData.map((row, i) => {
                      return (<Grid item key={i} sx={{ display: 'flex', marginBottom: '3rem'}}>
                      { row.map((ele, j) => {
                        return <Grid item key={i*3 + j} xs={4} sx={{textAlign: 'center'}} onClick={() => handleImageChange(ele)}>
                            <img src={ele.path} alt="img" width='70%' height='100%' />
                            <Typography id="keep-mounted-modal-title" variant="h6" color='#985e03' fontWeight={600} align='center' component="h6">
                              {ele.link}
                            </Typography>
                          </Grid>
                      })}
                      </Grid>)
                    })}
                  </ImageContainer>
                </Grid>
                <Modal
                  keepMounted
                  open={showModal}
                  onClose={handleCloseModal}
                  aria-labelledby='keep-mounted-modal-title'
                  aria-describedby='keep-mounted-modal-description'
                >
                  <Box sx={modalstyle}>
                    <Grid container>
                      <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                        <form method='post' onSubmit={handleSubmit}>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <Typography variant='h5'>
                              Add News
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <FileInput fullWidth label='Choose File' size='small' required type='file' onChange={(e) => setImage(e.target.files[0])} />
                          </Grid>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <AdminTextField fullWidth label='Link URL' size='small' required type='text' value={link} onChange={e => setLink(e.target.value)} />
                          </Grid>
                          <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                            <AuthButton variant='outlined' type="submit" fullWidth>
                              Add
                            </AuthButton>
                          </Stack>
                        </form>
                      </Grid>
                      <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                      </Stack>
                    </Grid>
                  </Box>
                </Modal>

                <Modal
                  keepMounted
                  open={showEditModal}
                  onClose={handleCloseEditModal}
                  aria-labelledby='keep-mounted-modal-title'
                  aria-describedby='keep-mounted-modal-description'
                >
                  <Box sx={modalstyle}>
                    <Grid container>
                      <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                        <form method='post'>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <Typography variant='h5'>
                              Delete News
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <AdminTextField fullWidth label='Name' size='small' required type='text' disabled value={image} onChange={e => setImage(e.target.value)} />
                          </Grid>
                          <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <AdminTextField fullWidth label='Link URL' size='small' required type='text' disabled value={link} onChange={e => setLink(e.target.value)} />
                          </Grid>
                          <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                            {/* <AuthButton variant='outlined' onClick={handleUpdate}>
                              Update
                            </AuthButton> */}
                            <AuthButton variant='outlined' onClick={handleRemove}>
                              Remove
                            </AuthButton>
                          </Stack>
                        </form>
                      </Grid>
                      <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                      </Stack>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
            </DashboardBody>
          </AdminMainBody>
        </AdminBody>
    	</AdminLayout>
    </>
  );
}

export default News;