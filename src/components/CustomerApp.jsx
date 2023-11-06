import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { closeModal, openModal, setVisible, showToastInfo } from '../utils';
import { EditCustomerApp } from './EditCustomerApp';
import { CONFI } from '../utils/config';

export const CustomerApp = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [users, setUsers] = useState([]);
    const [usersFiltered, setUsersFiltered] = useState([])
    const [userSelected, setUserSelected] = useState(null);
    const addCustomer = (data) => {
        axios.post(`${CONFI.uri}/user/add`, { ...data, monthly_income: parseFloat(data.monthly_income) })
            .then(r => {
                closeModal('#add_customer');
                showToastInfo('El usuario se registró correctamente');
                getCustomers();
            })
            .catch(error => showToastInfo(error.response.data.error));
    }
    const getCustomers = () => {
        axios.get(`${CONFI.uri}/user/list`)
            .then(res => {
                setUsers(res.data);
                setUsersFiltered(res.data);
                reset();
            })
            .catch(error => console.log(error));
    }
    const deleteCustomer = (customerId) => {
        axios.get(`${CONFI.uri}/user/delete/${customerId}`)
            .then(res => {
                showToastInfo('Usuario eliminado correctamente');
                getCustomers();
                reset();
            })
            .catch(error => console.log(error));
    }
    const searchCustomers = (param) => {
        param = param.toLowerCase();
        setUsersFiltered(users.filter(u => u.name.toLowerCase().includes(param) || u.dni.toLowerCase().includes(param) || u.lname.toLowerCase().includes(param)));
    }
    useEffect(() => {
        getCustomers();
    }, [])
    return (
        <>
            <NavApp logged={true} />
            {userSelected && <EditCustomerApp customer={userSelected} setUser={setUserSelected} getCustomers={getCustomers} />}
            <div className="container">
                <br />
                <h4>Clientes</h4>
                <hr />
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <button className='btn btn-successi' onClick={() => openModal('#add_customer')}>Agregar cliente</button>
                        </div>
                        <div className="form-group">
                            <label >Buscar cliente</label>
                            <input type="text" className='form-control bg-white' placeholder='Nombre del cliente..' onChange={(e) => searchCustomers(e.target.value)} />
                        </div>
                        <div className='table-customer'>
                            <table className='text-center bg-white'>
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>DNI</th>
                                        <th>NOMBRE</th>
                                        <th>APELLIDO</th>
                                        <th>DIRECCIÓN</th>
                                        <th>TELEFONO</th>
                                        <th>EMAIL</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        usersFiltered.map((user, i) => (
                                            <tr key={user._id}>
                                                <td>{i + 1}</td>
                                                <td>{user.documentNumber}</td>
                                                <td>{user.name}</td>
                                                <td>{user.lname}</td>
                                                <td>{user.address}</td>
                                                <td>{user.telephone}</td>
                                                <td>{user.email}</td>
                                                <td className='text-center'>
                                                    <button className='btn btn-primari' onClick={() => {
                                                        setUserSelected(user);
                                                    }}>
                                                        <i className="fa-solid fa-user-pen"></i></button>
                                                    <button className='btn btn-danger ml-1' onClick={() => deleteCustomer(user._id)}><i className="fa-solid fa-user-minus"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {usersFiltered.length == 0 && <p className='mt-2 text-center'>No existen clientes</p>}
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
                        <div className="input-group">
                            <div className='form-group'>
                                <label className='form-label'>Tipo de documento</label>
                                <select className='form-control' {...register('documentType')}>
                                    <option value="DNI">DNI</option>
                                    <option value="CE">Carné de Extranjería</option>
                                    <option value="P">Pasaporte</option>
                                </select>
                            </div>
                            <div className='form-group ml-2'>
                                <label className='form-label'>Número de documento</label>
                                <input {...register('documentNumber', { required: true })} type="text" className='form-control' placeholder='4556756..' />
                            </div>
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
                            <label className='form-label'>Dirección</label>
                            <input {...register('address', { required: true })} type="text" className='form-control' placeholder='Av. ..' />
                        </div>
                        <div className="input-group">
                            <div className='form-group'>
                                <label className='form-label'>Teléfono</label>
                                <input {...register('telephone', { required: true, })} type="text" className='form-control' placeholder='93..' />
                            </div>
                            <div className='form-group ml-2'>
                                <label className='form-label'>Email</label>
                                <input {...register('email', { required: true, })} type="email" className='form-control' placeholder='...@gmail.com' />
                            </div>
                        </div>
                        <button className='btn btn-success mt-2 w-100' type='submit'>Guardar</button>
                    </form>
                </div>
            </div>
            <br />
        </>

    )
}
