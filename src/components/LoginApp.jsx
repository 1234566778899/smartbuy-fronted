import React, { useState } from 'react'
import '../styles/main.css'
import { NavApp } from './NavApp'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/main.css'
import { showToastInfo } from '../utils'
import { CONFI } from '../utils/config'


export const LoginApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [alert, setAlert] = useState(null);
    const login = (data) => {
        data.username = data.email;
        axios.post(`${CONFI.uri}/user/login`, data)
            .then(response => {
                localStorage.setItem('id', response.data.id);
                navigate('/dashboard');
                localStorage.setItem('nav', 'dashboard');
            })
            .catch(error => {
                showToastInfo(error.response.data.error);
            })
    }
    return (
        <>
            <div className="login-box">
                <NavApp />
                <div className="container">
                    <br />
                    <div className="row">
                        <div className="col-md-4 ">

                        </div>
                        <div className="col-md-4 p-3 mt-4 box-login">
                            <h3 className='text-center'>INICIAR SESIÓN</h3>
                            <br />
                            <form onSubmit={handleSubmit(login)}>
                                <div className="form-group">
                                    <label>Correo electrónico</label>
                                    <input  {...register('email', { required: true })} type="text" />
                                    {errors.email && <span className='alerta'>Debe ingresar su correo o nombre de usuario</span>}
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input {...register('password', { required: true })} type="password" />
                                    {errors.password && <span className='alerta'>Debe ingresar contraseña</span>}
                                </div>
                                <button className='btn btn-primary mt-3 w-100'>Login</button>
                                {alert && <p className='alert alert-danger mt-3'>{alert}</p>}
                                <p className='text-center mt-3'>¿No tienes una cuenta? <a href="#" className='text-white' onClick={() => navigate('/register')}><strong>Registrate</strong></a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
