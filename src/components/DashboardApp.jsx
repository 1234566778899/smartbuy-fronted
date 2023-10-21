import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { ChartArea } from './ChartArea'
import axios from 'axios';
import { showToastInfo } from '../utils';

export const DashboardApp = () => {
    const [users, setUsers] = useState([]);
    const [quotations, setquotations] = useState([]);

    const getQuotations = () => {
        axios.post('http://localhost:4000/quotation/list', {})
            .then(response => setquotations(response.data))
            .catch(error => {
                showToastInfo('Error');
            })
    }
    const getCustomers = () => {
        axios.get('http://localhost:4000/user/list')
            .then(res => {
                setUsers(res.data);
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {
        getCustomers();
        getQuotations();
    }, [])
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h4>Dashboard</h4>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <div className='mb-1'>
                            <div className='tarjeta'>
                                <span className='name'>Clientes</span><br />
                                <span className='quantity'>{users.length}</span>
                            </div>
                            <div className='tarjeta ml-2'>
                                <span className='name'>Cotizaciones</span><br />
                                <span className='quantity'>{quotations.length}</span>
                            </div>
                        </div>
                        <div className='box-chart p-3'>
                            <ChartArea />
                        </div>
                    </div>

                </div>
                <div>

                </div>
            </div>
        </>
    )
}
