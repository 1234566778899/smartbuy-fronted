import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavApp } from './NavApp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const RegisterApp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null)

    const submitRegister = (data) => {
        axios.post('http://localhost:4000/register', data)
            .then(res => {
                navigate('/dashboard');
            })
            .catch(error => {
                setAlert(error.response.data.error);
            })
    }
    return (
        <>
            <div className="login-box">
                <NavApp />
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 ">

                        </div>
                        <div className="col-md-5 card p-3 mt-4">
                            <h1 className='text-center'>REGISTRO</h1>
                            <br />
                            <form onSubmit={handleSubmit(submitRegister)}>
                                <div className="form-group">
                                    <label>Nombre de usuario</label>
                                    <input {...register('username', { required: true })} type="text" className='form-control' />
                                    {errors.username && <span className='text-danger alerta'>El nombre de usuario es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <label>Correo</label>
                                    <input {...register('email', { required: true })} type="email" className='form-control' />
                                    {errors.email && <span className='text-danger alerta'>El correo electrónico es obligatorio</span>}
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input {...register('password', { required: true })} type="password" className='form-control' />
                                    {errors.password && <span className='text-danger alerta'>La contraseña es obligatorio</span>}
                                </div>
                                <button className='btn btn-primary mt-4 w-100'>SIGN UP</button>
                                {alert && <p className='alert alert-danger mt-2'>{alert}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
