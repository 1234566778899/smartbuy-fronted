import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavApp } from './NavApp';
import { CONFI } from '../utils/config';
import axios from 'axios';
import { closeModal, openModal, showToastInfo, soloNumerosDecimales } from '../utils';
import { useForm } from 'react-hook-form';

export const DetailsQuotation = () => {
    const { id } = useParams();
    const [symbol, setSymbol] = useState('');
    const [quotation, setQuotation] = useState(null);
    const [porRenovar, setPorRenovar] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const submitChangeState = (estado) => {
        axios.put(`${CONFI.uri}/quotation/state/${id}`, { estado })
            .then(res => {
                if (estado == 'entregado') showToastInfo('El vehículo ha sido devuelto');
                if (estado == 'comprado') showToastInfo('El vehículo ha sido comprado');
                if (estado == 'curso') showToastInfo('El flujo esta en curso');
                getQuotations();
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error')
            })
    }

    const getQuotations = () => {
        axios.get(`${CONFI.uri}/quotation/${id}`)
            .then(res => {
                console.log(res.data)
                setQuotation(res.data);
                setSymbol(res.data.currency == 'USD' ? '$' : 'S/.');
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error')
            })
    }
    useEffect(() => {
        getQuotations();
    }, [])
    /* eslint-disable no-restricted-globals */
    const addNewQuotation = (data) => {
        console.log(1);
        console.log(data.tasaDes);
        if (data.tasacion < quotation.finalDue) {
            if (confirm('¿La tasación es menor al valor de la deuda, esta seguro que desea continuar?')) {
                submitReferenceQuotation(data);
            }
        } else {
            submitReferenceQuotation(data);
        }
    }
    const submitReferenceQuotation = (data) => {
        axios.put(`${CONFI.uri}/quotation/reference/${id}`, { reference: data.tasacion })
            .then(res => {
                navigate(`/add/quotation/${id}`);
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error')
            })
    }
    return (
        <div className={`summary`}>
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h4 className='text-center'>Detalles de la cotización</h4>
                <div className='text-center'>
                    {quotation && quotation.estado == 'pendiente' && <button className='btn btn-primary' onClick={() => submitChangeState('curso')}>Adquirir</button>}
                    {quotation && quotation.estado == 'curso' && <button id='end_buy' className='btn btn-primary' onClick={() => openModal('#add_customer')}>Finalizar flujo</button>}
                </div>
                <br />
                <div className="row bg-white">
                    <div className="col-md-6">
                        <br></br>
                        <span className='subtitle'>Datos del prestamo</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Moneda</td>
                                    <td className='value'>{quotation && quotation.currency == 'USD' ? 'Dolares' : 'Soles'}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Precio de venta del activo</td>
                                    <td className='value'>{quotation && (quotation.estado == 'renovado' ? (<span> <span className='tachado'>{symbol} {quotation.car.price} </span> {symbol} {quotation.real}</span>) : <span>{quotation.car.price}</span>)}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>% Cuota inicial</td>
                                    <td className='value'>{quotation && quotation.porcInicial} %</td>
                                </tr>
                                <tr>
                                    <td >% Cuota final</td>
                                    <td className='value'>{quotation && quotation.porcFinal} %</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Nro de años</td>
                                    <td className='value'>{quotation && quotation.numDues / 12}</td>
                                </tr>
                                <tr >
                                    <td className='key'>Tasa de interes</td>
                                    <td className='value'>{quotation && quotation.tasaInteres} %</td>
                                </tr>
                                <tr >
                                    <td className='key'>Tipo de tasa de interes</td>
                                    <td className='value'>{quotation && quotation.tipoTasa.toUpperCase()}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Periodo de capitalización</td>
                                    <td className='value'>{quotation && quotation.periodo == 1 ? 'Diario' : 'Mensual'}</td>
                                </tr>
                                <tr >
                                    <td className='key'>Frecuencia de pago</td>
                                    <td className='value'>{quotation && quotation.frecuencyPay} dias</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Nro de dias por año</td>
                                    <td className='value'>{quotation && quotation.daysYear}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Datos de los costes/gastos iniciales</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Costes Notariales	</td>
                                    <td className='value'>{symbol} {quotation && quotation.notariales}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Costes Registrales</td>
                                    <td className='value'>{symbol} {quotation && quotation.registrales}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Tasación</td>
                                    <td className='value'>{symbol} {quotation && quotation.tasacion}</td>
                                </tr>
                                <tr>
                                    <td >Comisión de estudio</td>
                                    <td className='value'>{symbol} {quotation && quotation.comEstudio}</td>
                                </tr>
                                <tr>
                                    <td >Comisión de activación</td>
                                    <td className='value'>{symbol} {quotation && quotation.comActivacion}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Datos de los costes/gastos periodicos</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Comision periodica</td>
                                    <td className='value'>{symbol} {quotation && quotation.comision}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Portes</td>
                                    <td className='value'>{symbol} {quotation && quotation.portes}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Gastos de Administración</td>
                                    <td className='value'>{symbol} {quotation && quotation.gastAdm}</td>
                                </tr>
                                <tr>
                                    <td >% de Seguro desgravamen</td>
                                    <td className='value'>{quotation && quotation.insure} %</td>
                                </tr>
                                <tr className='impar'>
                                    <td >% de Seguro riesgo</td>
                                    <td className='value'>{quotation && quotation.porcRisk} %</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Datos del costo de oportunidad</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Tasa de descuento (COK)</td>
                                    <td className='value'>{quotation && quotation.cok} %</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                    </div>
                    <div className="col-md-6">
                        <br></br>
                        <span className='subtitle'>Resultados del financiamiento</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Tasa efectiva anual (TEA)</td>
                                    <td className='value'>{quotation && quotation.fee.toFixed(2)} %</td>
                                </tr>
                                <tr>
                                    <td className='key'>Tasa efectiva mensual (TEM)</td>
                                    <td className='value'>{quotation && quotation.tem.toFixed(2)} %</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Nº Cuotas por Año</td>
                                    <td className='value'>{12}</td>
                                </tr>
                                <tr>
                                    <td >Nº Total de Cuotas	</td>
                                    <td className='value'>{quotation && quotation.numDues}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Cuota inicial</td>
                                    <td className='value'>{symbol} {quotation && quotation.initialDue.toFixed(2)}</td>
                                </tr>
                                <tr >
                                    <td className='key'>Cuota final</td>
                                    <td className='value'>{symbol} {quotation && quotation.finalDue.toFixed(2)}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Monto del préstamo</td>
                                    <td className='value'>{symbol} {quotation && (quotation.monto.toFixed(2))}</td>
                                </tr>
                                <tr >
                                    <td className='key'>Saldo a financiar con cuotas</td>
                                    <td className='value'>{symbol} {quotation && quotation.loanAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Resultado de los costes/gastos periodicos</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>% de Seguro desgrav. per.</td>
                                    <td className='value'>{quotation && quotation.insure} %</td>
                                </tr>
                                <tr>
                                    <td className='key'>Seguro riesgo</td>
                                    <td className='value'>{symbol} {quotation && quotation.risk.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Resultados de totales por</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Intereses</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalInterest.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Amortización del capital</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalAmort.toFixed(2)}</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>Seguro de desgravamen</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalSegDes.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td >Seguro contra todo riesgo</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalRisk.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td >Comisión periódica</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalComi}</td>
                                </tr>
                                <tr>
                                    <td >Portes</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalPortes}</td>
                                </tr>
                                <tr>
                                    <td >Gastos de administración</td>
                                    <td className='value'>{symbol} {quotation && quotation.totalAdm}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <span className='subtitle'>Indicadores de Rentabilidad</span>
                        <hr />
                        <table className='detail-table'>
                            <tbody>
                                <tr className='impar'>
                                    <td className='key'>Tasa de descuento (COKi)</td>
                                    <td className='value'>{quotation && (quotation.tasaDes * 100).toFixed(5)} %</td>
                                </tr>
                                <tr >
                                    <td className='key'>TIR de la operación</td>
                                    <td className='value'>{quotation && quotation.tir.toFixed(5)} %</td>
                                </tr>
                                <tr className='impar'>
                                    <td className='key'>TCEA de la operación</td>
                                    <td className='value'>{quotation && quotation.TCEA.toFixed(5)}</td>
                                </tr>
                                <tr>
                                    <td className='key'>VAN operación</td>
                                    <td className='value'>{quotation && quotation.van.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                    </div>
                </div>
                <br />
                <div className="table-schedule">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>N°</th>
                                <th style={{ width: '60px' }}>TEA</th>
                                <th style={{ width: '100px' }}>TEM</th>
                                <th >PG</th>
                                <th>Saldo Inicial</th>
                                <th>Interés</th>
                                <th>Cuota</th>
                                <th>Amort.</th>
                                <th>Seguro  desgrav</th>
                                <th>Seguro de riesgo</th>
                                <th>Comisión</th>
                                <th>Portes</th>
                                <th>Gastos Adm.</th>
                                <th>Saldo Final.</th>
                                <th>Flujo.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0</td>
                                <td colSpan={13}></td>
                                <td>{quotation && quotation.monto.toFixed(2)}</td>
                            </tr>
                            {
                                quotation && quotation.flows.map(pay => (
                                    <tr key={pay.n}>
                                        <td>{pay.n}</td>
                                        <td>{pay.tea.toFixed(2)}%</td>
                                        <td>{pay.tep.toFixed(5)} %</td>
                                        <td>{pay.pg == 'S' ? '-' : (pay.pg == 'T' ? 'Total' : 'Parcial')}</td>
                                        <td>{pay.si.toFixed(2)}</td>
                                        <td>{pay.i.toFixed(2)}</td>
                                        <td>{pay.cuota.toFixed(2)}</td>
                                        <td>{pay.a.toFixed(2)}</td>
                                        <td>{pay.segDes.toFixed(2)}</td>
                                        <td>{pay.segRis.toFixed(2)}</td>
                                        <td>{pay.comision}</td>
                                        <td>{pay.portes}</td>
                                        <td>{pay.gastAdm.toFixed(2)}</td>
                                        <td>{pay.sf.toFixed(2)}</td>
                                        <td>{pay.flujo.toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <br />
                <br />
            </div>
            <div id='add_customer'>
                <div className='box' id='end_quotation'>
                    <div className='text-right'>
                        <span className='icono-close' onClick={() => { setPorRenovar(false); closeModal('#add_customer'); }}>
                            <i className="fa-solid fa-rectangle-xmark"></i></span>
                    </div>
                    <h5 className='text-center'>¿Cómo desea finalizar su compra?</h5>
                    <div className='btn-opciones mt-3'>
                        {porRenovar && <button className='renovado' onClick={() => setPorRenovar(false)}>Cancelar</button>}

                        {
                            !porRenovar && <div>
                                <button className='renovado' id='btn_renovar' onClick={() => setPorRenovar(true)}>Renovar</button>
                                <button className='comprado' onClick={() => { submitChangeState('comprado'); closeModal('#add_customer') }}>Quedarse</button>
                                <button className='entregado' onClick={() => { submitChangeState('entregado'); closeModal('#add_customer') }}>Devolver</button>
                            </div>
                        }
                    </div>
                    <br />
                    {
                        porRenovar && <div className="px-5">
                            <p className='text-center'>Ingrese la tasación o precio actual del vehículo</p>
                            <form onSubmit={handleSubmit(addNewQuotation)}>
                                <input onInput={(e) => soloNumerosDecimales(e)} {...register('tasacion', { required: true })} type="text" className='form-control text-center' placeholder={symbol} />
                                {errors.tasacion && <p className='text-danger'>Debe ingresar la tasación</p>}
                                <div className='d-flex justify-content-center mt-2'>
                                    <button type='submit' className='btn btn-primary ml-2'>Aceptar</button>
                                </div>
                            </form>
                            <br />
                        </div>
                    }
                    <p className='text-center'>¿Necesitas más información? <span className='ancla' onClick={() => navigate('/info')}>Click aqui</span> </p>
                </div>

            </div>

        </div>
    )
}
