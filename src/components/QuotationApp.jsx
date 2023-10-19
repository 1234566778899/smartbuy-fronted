import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { parseDate, parseFormatDate, showToastInfo } from '../utils';

export const QuotationApp = () => {
    const navigate = useNavigate();

    const [quotations, setquotations] = useState([]);

    const getQuotations = () => {
        axios.get('http://localhost:4000/quotation/list')
            .then(response => setquotations(response.data))
            .catch(error => {
                showToastInfo('Error');
            })
    }
    useEffect(() => {
        getQuotations();
    })
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h3>Historial de cotizaciones</h3>
                <hr />
                <div className="text-right">
                    <button className='btn btn-primary mb-2' onClick={() => navigate('/add/quotation')}>AGREGAR COTIZACIÓN</button>
                </div>
                <div className='d-flex'>
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Inicio' />
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Fin' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='DNI' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Nombre' />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Apellido' />
                    <button className='btn btn-success'>Buscar</button>
                </div>
                <br />
                <div className="table-crud-quotation">
                    <table className='bg-white table-quotation'>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Fecha</th>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>VAN</th>
                                <th>TIR</th>
                                <th>CRÉDITO</th>
                                <th>INTERÉS</th>
                                <th>Número de cuotas</th>
                                <th>Documento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quotations.map((quo, i) => (
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>{parseFormatDate(quo.createdAt)}</td>
                                        <td>DNI</td>
                                        <td>Nombre</td>
                                        <td>Apellido</td>
                                        <td>VAN</td>
                                        <td>TIR</td>
                                        <td>{quo.loanAmount}</td>
                                        <td>{quo.fee} %</td>
                                        <td>{quo.numDues}</td>
                                        <td><button>Descargar <i className="ml-2 fa-solid fa-circle-down"></i></button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
