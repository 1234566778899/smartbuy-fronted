import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { onlyEnteros, showToastInfo, soloLetras } from '../utils';
import { generatePdfSchedule } from '../utils/pdf/Schedule';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { CONFI } from '../utils/config';

export const QuotationApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [quotations, setquotations] = useState(null);
    const getQuotations = (data) => {
        axios.post(`${CONFI.uri}/quotation/list`, data)
            .then(response => {
                setquotations(response.data ? response.data : []);
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
        <div className='summary'>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h4>Historial de cotizaciones</h4>
                <hr />
                <form onSubmit={handleSubmit(searchQuotation)} className='d-flex form-search-quotation py-1'>
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Inicio' {...register('inicio')} />
                    <input type="date" className='form-control ml-1 bg-white' placeholder='Fin' {...register('fin')} />
                    <input onInput={(e) => onlyEnteros(e.target)} type="text" className='form-control ml-1 bg-white' placeholder='DNI'{...register('documentNumber')} />
                    <input onInput={(e) => soloLetras(e)} type="text" className='form-control ml-1 bg-white' placeholder='Nombre'{...register('name')} />
                    <input onInput={(e) => soloLetras(e)} type="text" className='form-control ml-1 bg-white' placeholder='Apellido'{...register('lname')} />
                    <button className='btn btn-success' type='submit'>Buscar</button>
                </form>
                <div className='leyenda mb-2'>
                    <span className='bg-danger shadow' onClick={() => getQuotations({ estado: 'pendiente' })}>Pendiente</span>
                    <span className='bg-success shadow' onClick={() => getQuotations({ estado: 'curso' })}>En curso</span>
                    <span className='bg-warning shadow' onClick={() => getQuotations({ estado: 'renovado' })}>Renovado</span>
                    <span className='bg-info shadow' onClick={() => getQuotations({ estado: 'comprado' })}>Comprado</span>
                    <span className='bg-secondary shadow' onClick={() => getQuotations({ estado: 'entregado' })}>Entregado</span>
                </div>
                <div className="table-crud-quotation">
                    <table className='bg-white table-quotation'>
                        <thead>
                            <tr className='bg-dark text-white'>
                                <th>N°</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>DNI</th>
                                <th>Cliente</th>
                                <th>VAN</th>
                                <th>TIR</th>
                                <th>COK</th>
                                <th>PRESTAMO</th>
                                <th>INTERÉS</th>
                                <th>Plazo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            {

                                quotations && quotations.map((quo, i) => (
                                    <tr key={quo._id} className={`row-quotation`}>
                                        <td>{i + 1}</td>
                                        <td >{quo.estado == 'curso' ? 'EN CURSO' : quo.estado.toUpperCase()}</td>
                                        <td>{moment(quo.createdAt).format('DD/MM/YYYY hh:mm:ss')}</td>
                                        <td>{quo.customer.documentNumber}</td>
                                        <td>{quo.customer.name} {quo.customer.lname}</td>
                                        <td>{quo.van.toFixed(2)}</td>
                                        <td>{quo.tir.toFixed(2)}%</td>
                                        <td>{(quo.tasaDes * 100).toFixed(2)}%</td>
                                        <td>{quo.currency == 'USD' ? '$' : 'S/.'} {quo.monto.toFixed(2)}</td>
                                        <td>{quo.fee.toFixed(2)} %</td>
                                        <td>{quo.numDues}</td>
                                        <td>
                                            <span className='eye-icon' onClick={() => navigate(`/quotation/${quo._id}`)}><i className="fa-solid fa-eye"></i></span>

                                            {
                                                quo.estado != 'pendiente' && <span className='pdf-icon ml-3' onClick={() => lookPdf(quo)}><i className="fa-solid fa-file-pdf"></i></span>
                                            }
                                            {
                                                quo.estado == 'pendiente' && <span className='trash-icon ml-3' onClick={() => deleteQuotations(quo._id)}><i className="fa-solid fa-trash"></i></span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {quotations && quotations.length == 0 && <p className='mt-2 text-center'>No existen operaciones</p>}
                </div>
                {
                    !quotations && <div className='loading'> <i className="fa-solid fa-spinner"></i></div>
                }
                <br />
            </div>
        </div>
    )
}
