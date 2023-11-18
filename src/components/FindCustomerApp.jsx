import React, { useEffect, useState } from 'react'
import { closeModal } from '../utils'
import axios from 'axios';
import { CONFI } from '../utils/config';

export const FindCustomerApp = ({ selectUser }) => {
    const [users, setUsers] = useState([]);
    const [userFiltered, setUserFiltered] = useState([])
    const getCustomers = () => {
        axios.get(`${CONFI.uri}/user/list`)
            .then(res => {
                setUsers(res.data);
                setUserFiltered(res.data);
            })
            .catch(error => console.log(error));
    }
    const searchCustomer = (value) => {
        value = value.toLowerCase();
        if (users) {
            const filtered = users.filter(x => x.documentNumber.toLowerCase().includes(value) || x.name.toLowerCase().includes(value) || x.lname.toLowerCase().includes(value))
            setUserFiltered(filtered);
        }
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
                    <input type="text" className='form-control' placeholder='Nombre del cliente..' onChange={(e) => searchCustomer(e.target.value)} />
                </div>
                <div className='table-find-customer mt-2'>
                    <table className='table text-center bg-white'>
                        <thead>
                            <tr>
                                <th>N° de documento</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userFiltered.map(user => (
                                    <tr key={user._id} onClick={() => { selectUser(user); closeModal('#find_customer') }}>
                                        <td>{user.documentNumber}</td>
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
