import React, { useEffect, useState } from 'react'
import { closeModal } from '../utils'
import axios from 'axios';

export const FindCustomerApp = ({ selectUser }) => {
    const [users, setUsers] = useState([]);
    const getCustomers = () => {
        axios.get('http://localhost:4000/user/list')
            .then(res => {
                setUsers(res.data);
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {
        getCustomers();
    }, [])
    return (
        <div id='find_customer'>
            <div className="box">
                <h4 className='text-center'>Seleccione un cliente</h4>
                <br />
                <div className='form-grouo'>
                    <h6 className='form-label'>Buscar cliente</h6>
                    <input type="text" className='form-control' placeholder='Nombre del cliente..' />
                </div>
                <div className='table-find-customer mt-2'>
                    <table className='table text-center bg-white'>
                        <thead>
                            <tr>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user => (
                                    <tr key={user._id} onClick={() => { selectUser(user); closeModal('#find_customer')}}>
                                        <td>{user.dni}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lname}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className='text-right mt-2'>
                    <button className='btn btn-danger' onClick={() => closeModal('#find_customer')}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
