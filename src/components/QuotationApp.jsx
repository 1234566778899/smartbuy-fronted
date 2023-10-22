import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { showToastInfo } from '../utils';
import { generatePdfSchedule } from '../utils/pdf/Schedule';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { CONFI } from '../utils/config';

export const QuotationApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [quotations, setquotations] = useState([]);

    const getQuotations = (data) => {
        axios.post(`${CONFI.uri}/quotation/list`, data)
            .then(response => {
                setquotations(response.data);
            })
            .catch(error => {
                showToastInfo('Error');
            })
    }

    const deleteQuotations = (id) => {
        axios.get(`${CONFI.uri}/quotation/delete/${id}`)
            .then(response => {
                showToastInfo(response.data.ok);
                getQuotations();
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error');

            })
    }
    const lookPdf = (data) => {
        generatePdfSchedule(data.flows, data);
    }
    const searchQuotation = (data) => {
        const { inicio, fin, documentNumber, name, lname } = data;

        if (inicio && fin) {
            const i = new Date(inicio);
            const f = new Date(fin);
            if (i > f) return showToastInfo('La fecha de inicio no debe ser mayor a la fecha de fin');
        }
        getQuotations({ inicio, fin, documentNumber, name, lname });
    }
    useEffect(() => {
        getQuotations({});
    }, [])
    return (
        <>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h4>Historial de cotizaciones</h4>
                <hr />
                <div className="text-right">
                    <button className='btn btn-primary mb-2' onClick={() => navigate('/add/quotation')}>AGREGAR COTIZACIÓN</button>
                </div>
                <form onSubmit={handleSubmit(searchQuotation)} className='d-flex form-search-quotation py-1'>
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Inicio' {...register('inicio')} />
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Fin' {...register('fin')} />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='DNI'{...register('dni')} />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Nombre'{...register('name')} />
                    <input type="text" className='form-control ml-1 bg-white' placeholder='Apellido'{...register('lname')} />
                    <button className='btn btn-success' type='submit'>Buscar</button>
                </form>
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
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quotations.map((quo, i) => (
                                    <tr key={quo._id}>
                                        <td>{i + 1}</td>
                                        <td>{moment(quo.createdAt).format('DD/MM/YYYY')}</td>
                                        <td>{quo.customer.dni}</td>
                                        <td>{quo.customer.name}</td>
                                        <td>{quo.customer.lname}</td>
                                        <td>{quo.van.toFixed(2)}</td>
                                        <td>{quo.tir.toFixed(2)}</td>
                                        <td>{quo.loanAmount}</td>
                                        <td>{quo.fee.toFixed(2)} %</td>
                                        <td>{quo.numDues}</td>
                                        <td><button className='px-3' onClick={() => lookPdf(quo)}>PDF<i className="ml-2 fa-sharp fa-solid fa-eye"></i></button></td>
                                        <td><button className='bg-danger px-4' onClick={() => deleteQuotations(quo._id)}><i className="fa-solid fa-trash"></i></button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {quotations.length == 0 && <p className='mt-2 text-center'>No existen operaciones</p>}
                </div>
                <br />
            </div>
        </>
    )
}
