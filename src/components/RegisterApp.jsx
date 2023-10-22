import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavApp } from './NavApp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CONFI } from '../utils/config';

export const RegisterApp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null)

    const submitRegister = (data) => {
        axios.post(`${CONFI.uri}/user/register`, data)
            .then(response => {
                localStorage.setItem('id', response.data.id);
                navigate('/dashboard');
                localStorage.setItem('nav', 'dashboard');
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
                            <h3 className='text-center'>REGISTRO</h3>
                            <br />
                            <form onSubmit={handleSubmit(submitRegister)}>
                                <div className="form-group">
                                    <label>Nombre de usuario</label>
                                    <input {...register('username', { required: true })} type="text" />
                                    {errors.username && <span className='text-danger alerta'>El nombre de usuario es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <label>Correo</label>
                                    <input {...register('email', { required: true })} type="email" />
                                    {errors.email && <span className='text-danger alerta'>El correo electrónico es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input {...register('password', { required: true })} type="password" />
                                    {errors.password && <span className='text-danger alerta'>La contraseña es obligatorio</span>}
                                </div>
                                <button className='btn btn-primari mt-3 w-100'>SIGN UP</button>
                                {alert && <p className='alert alert-danger mt-2'>{alert}</p>}
                                <p className='text-center mt-3'>¿Ya tienes una cuenta? <a href="#" className='text-white' onClick={() => navigate('/login')}><strong>Iniciar sesión</strong></a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
