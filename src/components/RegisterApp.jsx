import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavApp } from './NavApp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CONFI } from '../utils/config';
import logo from '../assets/logo.png'
import { showToastInfo } from '../utils';
export const RegisterApp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null)

    const submitRegister = (data) => {
        axios.post(`${CONFI.uri}/user/register`, data)
            .then(response => {
                showToastInfo(response.data.ok);
                navigate('/login');
            })
            .catch(error => {
                console.log(error);
                setAlert(error.response.data.error || 'Error');
            })
    }
    return (
        <>
            <div className="login-box">
                <NavApp />
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 ">

                        </div>
                        <div className="col-md-4 p-3 mt-4 box-registro">
                            <div className="text-center">
                                <img src={logo} alt="img" width={50} />
                            </div>
                            <br />
                            <h3 className='text-center'>REGISTRO</h3>
                            <br />
                            <form onSubmit={handleSubmit(submitRegister)}>
                                <div className="form-group">
                                    <span>Nombre de usuario</span>
                                    <input {...register('username', { required: true })} type="text" placeholder='your name' />
                                    {errors.username && <span className='text-danger alerta'>El nombre de usuario es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <span>Correo</span>
                                    <input {...register('email', { required: true })} type="email" placeholder='you@example.com' />
                                    {errors.email && <span className='text-danger alerta'>El correo electrónico es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <span>Contraseña</span>
                                    <input {...register('password', { required: true })} type="password" placeholder='Enter 6 character or more' />
                                    {errors.password && <span className='text-danger alerta'>La contraseña es obligatorio</span>}
                                </div>
                                <button className='btn btn-primari mt-3 w-100'>SIGN UP</button>
                                {alert && <p className='alert alert-danger mt-2'>{alert}</p>}
                                <p className='text-center mt-3'>¿Ya tienes una cuenta? <a href="#" onClick={() => navigate('/login')}><strong>Iniciar sesión</strong></a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
