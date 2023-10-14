import React, { useState } from 'react'
import '../styles/main.css'
import { NavApp } from './NavApp'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/main.css'
export const LoginApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [alert, setAlert] = useState(null);
    const login = (data) => {
        data.username = data.email;
        axios.post('http://localhost:4000/user/login', data)
            .then(x => {
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
                            <h1 className='text-center'>INICIAR SESIÓN</h1>
                            <br />
                            <form onSubmit={handleSubmit(login)}>
                                <div className="form-group">
                                    <label>Username o Correo</label>
                                    <input  {...register('email', { required: true })} type="text" className='form-control' />
                                    {errors.email && <span className='alerta'>Debe ingresar su correo o nombre de usuario</span>}
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input {...register('password', { required: true })} type="password" className='form-control' />
                                    {errors.password && <span className='alerta'>Debe ingresar contraseña</span>}
                                </div>
                                <button className='btn btn-success mt-4 w-100'>Login</button>
                                {alert && <p className='alert alert-danger mt-3'>{alert}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
