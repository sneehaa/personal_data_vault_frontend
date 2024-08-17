import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleDataApi, updateDataApi } from '../apis/api';
import { Button, TextField, Typography, Box, Grid, Avatar, Divider } from '@mui/material';

const EditData = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [oldImage, setOldImage] = useState('');
    const [dataFile, setDataFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        getSingleDataApi(id).then((res) => {
            setFullName(res.data.data.fullName);
            setDateOfBirth(res.data.data.dateOfBirth);
            setAddress(res.data.data.address);
            setPhoneNumber(res.data.data.phoneNumber);
            setEmail(res.data.data.email);
            setOldImage(res.data.data.dataFileUrl);
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load data');
        });
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setDataFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('address', address);
        formData.append('phoneNumber', phoneNumber);
        formData.append('email', email);
        formData.append('dataFile', dataFile);

        updateDataApi(id, formData).then((res) => {
            if (res.data.success === false) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);
                navigate('/');
            }
        }).catch((err) => {
            console.error(err);
            toast.error('Internal Server Error!');
        });
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f1f8f6', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom align="center" color="#388e3c">
                Edit Data - <span style={{ color: '#d32f2f' }}>{fullName}</span>
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#c8e6c9' }} />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Date of Birth"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            component="label"
                            color="success"
                            fullWidth
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Upload Image
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                hidden
                            />
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            Update Data
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} direction="column" alignItems="center">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>Old Image Preview</Typography>
                        <Avatar
                            src={oldImage}
                            sx={{ width: 300, height: 300, mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>New Image</Typography>
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Data Image"
                                style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 8 }}
                            />
                        ) : (
                            <Typography>No image selected!</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditData;
