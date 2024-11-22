import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Material-UI
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { useStateContext } from 'contexts/contextProvider'; // Adjust path accordingly

// Assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axis from 'axis'; // Assuming 'axis' is the axios instance in your project

export default function AuthLogin() {
    const { setUser, setToken, messageSuccess } = useStateContext(); // Context methods
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const loginUser = async (values, { setErrors, setSubmitting }) => {
        try {
            const response = await axis.post('/login', values); // Adjust endpoint if needed

            if (response.status === 200) {
                setToken(response.data.token);
                setUser(response.data.user);

                // Display success message
                messageSuccess('Login successful!', 'success');

                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setErrors({ submit: 'Login failed. Please try again.' });
            }
        } catch (error) {
            if (error.response?.data) {
                const backendErrors = error.response.data;
                const formErrors = {};

                // Map backend errors to Formik errors
                if (backendErrors.query) {
                    formErrors.query = backendErrors.query[0];
                }
                if (backendErrors.password) {
                    formErrors.password = backendErrors.password[0];
                }
                setErrors(formErrors);
            } else {
                setErrors({ submit: 'An error occurred. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    query: '',
                    password: '',
                    submit: null,
                }}
                validationSchema={Yup.object().shape({
                    query: Yup.string().required('Username or Matricule is required'),
                    password: Yup.string().max(255).required('Password is required'),
                })}
                onSubmit={loginUser}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="query-login">Username or Matricule</InputLabel>
                                    <OutlinedInput
                                        id="query-login"
                                        type="text"
                                        value={values.query}
                                        name="query"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter username or matricule"
                                        fullWidth
                                        error={Boolean(touched.query && errors.query)}
                                    />
                                </Stack>
                                {touched.query && errors.query && (
                                    <FormHelperText error id="standard-weight-helper-text-query-login">
                                        {errors.query}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                </Stack>
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) => setChecked(event.target.checked)}
                                                name="checked"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">Keep me signed in</Typography>}
                                    />
                                    <Link variant="h6" component={RouterLink} to="/forgot-password" color="text.primary">
                                        Forgot Password?
                                    </Link>
                                </Stack>
                            </Grid>

                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
}

AuthLogin.propTypes = {
    isDemo: PropTypes.bool,
};
