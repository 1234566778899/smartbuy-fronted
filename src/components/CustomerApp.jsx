import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { closeModal, openModal, showToastInfo } from '../utils';

export const CustomerApp = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [users, setUsers] = useState([]);
    const addCustomer = (data) => {
        axios.post('http://localhost:4000/user/add', { ...data, monthly_income: parseFloat(data.monthly_income) })
            .then(r => {
                closeModal('#add_customer');
                showToastInfo('El usuario se registró correctamente');
                getCustomers();
            })
            .catch(error => alert(error.response.data.error));
    }
    const getCustomers = () => {
        axios.get('http://localhost:4000/user/list')
            .then(res => {
                setUsers(res.data);
                reset();
            })
            .catch(error => console.log(error));
    }
    const deleteCustomer = (customerId) => {
        axios.get(`http://localhost:4000/user/delete/${customerId}`)
            .then(res => {
                showToastInfo('Usuario eliminado correctamente');
                getCustomers();
                reset();
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {

        getCustomers();
    }, [])
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h2>Clientes</h2>
                <hr />
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <button className='btn btn-success' onClick={() => openModal('#add_customer')}>Agregar cliente</button>
                        </div>
                        <div className="form-group">
                            <label >Buscar cliente</label>
                            <input type="text" className='form-control bg-white' placeholder='Nombre del cliente..' />
                        </div>
                        <div className='table-customer'>
                            <table className='table text-center bg-white'>
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>DNI</th>
                                        <th>NOMBRE</th>
                                        <th>APELLIDO</th>
                                        <th>INGRESO MENSUAL</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user, i) => (
                                            <tr key={user._id}>
                                                <td>{i + 1}</td>
                                                <td>{user.dni}</td>
                                                <td>{user.name}</td>
                                                <td>{user.lname}</td>
                                                <td>S/. {user.monthly_income}</td>
                                                <td className='d-flex'>
                                                    <button className='btn btn-info'>Editar</button>
                                                    <button className='btn btn-danger ml-1' onClick={() => deleteCustomer(user._id)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='add_customer'>
                <div className='box'>
                    <div className='text-right'>
                        <span className='icono-close' onClick={() => closeModal('#add_customer')}>X</span>
                    </div>
                    <h5 className='text-center'>Registrar cliente</h5>
                    <hr />
                    <form onSubmit={handleSubmit(addCustomer)}>
                        <div className='form-group'>
                            <label className='form-label'>DNI</label>
                            <input {...register('dni', { required: true })} type="text" className='form-control' placeholder='4556756..' />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Nombre</label>
                            <input {...register('name', { required: true })} type="text" className='form-control' placeholder='Escribe un nombre..' />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Apellido</label>
                            <input {...register('lname', { required: true })} type="text" className='form-control' placeholder='Escribe un apellido..' />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Ingreso mensual</label>
                            <input {...register('monthly_income', { required: true, valueAsNumber: true })} type="text" className='form-control' placeholder='S/ 00.00' />
                        </div>
                        <button className='btn btn-success mt-2 w-100' type='submit'>Guardar</button>
                    </form>
                </div>
            </div>
            <br />
        </>

    )
}
