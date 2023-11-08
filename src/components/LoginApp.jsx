import React, { useState } from 'react'
import '../styles/main.css'
import { NavApp } from './NavApp'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/main.css'
import { showToastInfo } from '../utils'
import { CONFI } from '../utils/config'
import logo from '../assets/logo.png'
import fondo from '../assets/student-849825_1280.jpg'
export const LoginApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const login = (data) => {
        data.username = data.email;
        axios.post(`${CONFI.uri}/user/login`, data)
            .then(response => {
                localStorage.setItem('id', response.data.id);
                navigate('/dashboard');
                localStorage.setItem('nav', 'dashboard');
            })
            .catch(error => {
                console.log(error);
                showToastInfo(error.response ? error.response.data.error : 'Error');
            })
    }
    return (
        <>
            <div className="login-box">
                <NavApp />
                <div className="container">
                    <br />
                    <div className="row shadow p-3 bg-dark" style={{ backgroundColor: '#FEFEFE' }}>
                        <div className="col-md-4"></div>
                        <div className="col-md-4 p-3 mt-4 box-login bg-white">
                            <div className='text-center'>
                                <img src={logo} alt="logo" width={50} />
                            </div>
                            <br />
                            <h3 className='text-center'>INICIAR SESIÓN</h3>
                            <br />
                            <form onSubmit={handleSubmit(login)}>
                                <div className="form-group">
                                    <span>Correo electrónico</span>
                                    <input  {...register('email', { required: true })} type="text" placeholder='you@example.com'/>
                                    {errors.email && <span className='alerta'>Debe ingresar su correo o nombre de usuario</span>}
                                </div>
                                <div className="form-group">
                                    <span>Contraseña</span>
                                    <input {...register('password', { required: true })} type="password" placeholder='Enter 6 character or more'/>
                                    {errors.password && <span className='alerta'>Debe ingresar contraseña</span>}
                                </div>
                                <button className='btn btn-primari mt-3 w-100'>Login</button>
                                <p className='text-center mt-3'>¿No tienes una cuenta? <a href="#" onClick={() => navigate('/register')}><strong>Registrate</strong></a></p>
                            </form>
                        </div>
                        <div className="col-md-4 ">
                           
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
