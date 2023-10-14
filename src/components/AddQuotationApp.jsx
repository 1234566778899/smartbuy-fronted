import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { openAcordeon, openModal } from '../utils'
import { FindCarApp } from './FindCarApp'
import { useForm, useWatch } from 'react-hook-form'

export const AddQuotationApp = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [currency, setCurrency] = useState();
    const [user, setuser] = useState();
    const [car, setcar] = useState()
    const [results, setResults] = useState()

    const [balanceFinance, setBalanceFinance] = useState()
    const [loanAmount, setLoanAmount] = useState()
    const [numberDuesYear, setNumberDuesYear] = useState()
    const [totalDues, settotalDues] = useState()
    const [insureDeduct, setInsureDeduct] = useState()
    const [riskInsure, setRiskInsure] = useState()

    const [payments, setPayments] = useState([]);

    const allForm = watch();
    const submitSchedule = (data) => {
        console.log(data)
    }

    const generateSchedule = (numDues, loanAmount, fee, insure, risk, portes) => {
        let pays = [];
        let si = loanAmount;
        for (let index = 0; index < numDues; index++) {
            let tep = Math.pow(1 + (fee / 100), 30 / 360) - 1;
            let interes = tep + (insure / 100);
            let cuota = loanAmount * ((interes * Math.pow(1 + interes, numDues)) / (Math.pow(1 + interes, numDues) - 1));
            let i = si * (Math.pow(1 + (fee / 100), 30 / 360) - 1);
            let segDes = (insure / 100) * si;
            let a = cuota - i - segDes;
            let sf = si - a;
            pays.push({
                n: index + 1,
                tea: fee,
                tep: (tep) * 100,
                pg: 'S',
                si,
                i,
                cuota,
                a,
                pp: 0,
                segDes,
                segRis: risk,
                comision: 0,
                portes: portes,
                gastAdm: 0,
                sf,
                flujo: cuota
            });
            si = sf;
        }
        setPayments(pays);
    }
    useEffect(() => {
        generateSchedule(180, 148530, 10, 0.05, 46.25, 3.5);
    }, [])

    useEffect(() => {
        const priceCar = (car && car.price) || 0;
        const initialDue = parseFloat(allForm.initial_due) || 0;
        setBalanceFinance(priceCar - (priceCar * initialDue / 100));
        const notarialCost = parseFloat(allForm.notarial_cost) || 0;
        const registrationCost = parseFloat(allForm.registration_cost) || 0;
        const appraisal = parseFloat(allForm.appraisal) || 0;
        const studyFee = parseFloat(allForm.study_fee) || 0;
        const activationFee = parseFloat(allForm.activation_fee) || 0;
        const total = notarialCost + registrationCost + appraisal + studyFee + activationFee;
        setLoanAmount(total + balanceFinance);
        const numAnios = parseFloat(allForm.num_years) || 0;
        const frecuencyPay = parseFloat(allForm.frecuency_pay) || 0;
        const daysYear = parseFloat(allForm.days_year) || 0;
        setNumberDuesYear(daysYear / frecuencyPay);
        settotalDues((daysYear / frecuencyPay) * numAnios);
        const creditLifeEnsurence = parseFloat(allForm.credit_life_insurence) || 0;
        const riskEnsurence = parseFloat(allForm.risk_insurence) || 0;
        setInsureDeduct((creditLifeEnsurence) / 30 * frecuencyPay);
        setRiskInsure((riskEnsurence / 100) * priceCar / numberDuesYear);
    }, [car, allForm])

    return (
        <>
            <FindCustomerApp selectUser={setuser} />
            <FindCarApp selectCar={setcar} />
            <NavApp logged={true} />
            <div className="container">
                <br />
                <h3>GENERAR COTIZACIÓN</h3>
                <hr />
                <br />
                <form className="row" onSubmit={handleSubmit(submitSchedule)}>
                    <div className="col-md-6">
                        <span className='form-label'>Cliente</span>
                        <div className="input-group">
                            <input type="text" className='form-control' readOnly value={user ? `${user.name} ${user.lname} - ${user.dni}` : ''} onFocus={() => openModal('#find_customer')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Moneda</span>
                            <select {...register('currency')} className='form-control bg-white' {...register('currency')} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="PEN">Soles</option>
                                <option value="USD">Dolares</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h6 className="mt-4">Costo de oportunidad</h6>
                        <hr />
                        <div className="form-group">
                            <span className='form-label'>Tasa</span>
                            <div className="input-group">
                                <select className='form-control bg-white'>
                                    <option value="efectiva">Efectiva</option>
                                    <option value="nominal">Nominal</option>
                                </select>
                                <input type="text" className='form-control bg-white ml-1' placeholder='25.5%' />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h6 className='mt-4'>Datos del prestamo</h6>
                        <hr />
                        <span className='form-label mt-2'>Precio de venta del Vehículo</span>
                        <input
                            value={car ? car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : ''}
                            type="text"
                            className="form-control"
                            readOnly
                            onFocus={() => openModal('#find_car')}
                        />
                        <div className="form-group mt-2">
                            <span className='form-label'>Cuota Inicial</span>
                            <select className='form-control bg-white' {...register('initial_due')}>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Tasa de interés</span>
                            <div className="input-group">
                                <select className='form-control bg-white'>
                                    <option value="efectiva">Efectiva</option>
                                    <option value="nominal">Nominal</option>
                                    <option value="descuento">Descuento</option>
                                </select>
                                <input type="text" className='form-control bg-white ml-1' placeholder='25.5%' />
                            </div>
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Número de años</span>
                            <input type="text" className="form-control bg-white" {...register('num_years')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Frecuencia de pago</span>
                            <input type="text" className="form-control bg-white" {...register('frecuency_pay')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>N° de dias al año</span>
                            <select className='form-control bg-white' {...register('days_year')}>
                                <option value="360">360</option>
                                <option value="365">365</option>
                            </select>
                        </div>


                    </div>
                    <div className="col-md-6">
                        <h6 className='mt-4'>Gastos iniciales</h6>
                        <hr />
                        <div className="form-group mt-2">
                            <span className='form-label'>Costos notariales</span>
                            <input type="text" className="form-control bg-white" {...register('notarial_cost')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Costos registrales</span>
                            <input type="text" className="form-control bg-white" {...register('registration_cost')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Tasación</span>
                            <input type="text" className="form-control bg-white" {...register('appraisal')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Comisión de estudio</span>
                            <input type="text" className="form-control bg-white" {...register('study_fee')} />
                        </div>
                        <div className="form-group mt-2">
                            <span className='form-label'>Comisión de activación</span>
                            <input type="text" className="form-control bg-white" {...register('activation_fee')} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h6 className='mt-4'>Gastos periodicos</h6>
                        <hr />
                    </div>
                    <div className="col-md-6">

                        <div className="form-group">
                            <span className='form-label'>Comisión periodica</span>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' {...register('periodic_commission')} />
                        </div>
                        <div className="form-group">
                            <span className='form-label'>Portes</span>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' {...register('shipping')} />
                        </div>
                        <div className="form-group">
                            <span className='form-label'>Gastos de administración</span>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' {...register('administration_expenses')} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <span className='form-label'>Seguro de desgravamen (%)</span>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' {...register('credit_life_insurence')} />
                        </div>
                        <div className="form-group">
                            <span className='form-label'>Seguro de riesgo (%)</span>
                            <input type="text" className='form-control bg-white' placeholder='0.0502%' {...register('risk_insurence')} />
                        </div>
                    </div>
                    <div className="col-md-12 mt-3">
                        <h6>Resultados</h6>
                        <hr />
                    </div>
                    <div className="col-md-6">
                        <div className='form-group'>
                            <span className='form-label'>Saldo a financiar</span>
                            <input type="text" className='form-control bg-white' readOnly value={balanceFinance} />
                        </div>
                        <div className='form-group'>
                            <span className='form-label'>Monto del prestamo</span>
                            <input type="text" className='form-control bg-white' readOnly value={loanAmount} />
                        </div>
                        <div className='form-group'>
                            <span className='form-label'>N° de cuotas al año</span>
                            <input type="text" className='form-control bg-white' readOnly value={numberDuesYear} />
                        </div>


                    </div>
                    <div className="col-md-6">
                        <div className='form-group'>
                            <span className='form-label'>N° total de cuotas</span>
                            <input type="text" className='form-control bg-white' readOnly value={totalDues} />
                        </div>
                        <div className='form-group'>
                            <span className='form-label'>% de Seguro desgrav. per.</span>
                            <input type="text" className='form-control bg-white' readOnly value={`${insureDeduct} %`} />
                        </div>
                        <div className='form-group'>
                            <span className='form-label'>Seguro riesgo</span>
                            <input type="text" className='form-control bg-white' readOnly value={riskInsure} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <button className='btn btn-success mt-3' type='submit'>GENERAR CRONOGRAMA DE PAGOS</button>
                    </div>
                </form>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-6">
                        <h4>Indicadores de Rentabilidad</h4>
                        <hr />
                        <table className='table-cost w-100'>
                            <tbody>
                                <tr>
                                    <td>Tasa de Descuento</td>
                                    <td>1.87693%</td>
                                </tr>
                                <tr>
                                    <td>TIR de la operación</td>
                                    <td>0.89251%</td>
                                </tr>
                                <tr>
                                    <td>TCEA de la operación</td>
                                    <td>11.25181%</td>
                                </tr>
                                <tr>
                                    <td>VAN operación</td>
                                    <td> 63,135.10</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br />
                <br />
                <h4>Cronograma de Pagos</h4>
                <hr />
                <div className="table-schedule">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>N°</th>
                                <th style={{ width: '50px' }}>TEA</th>
                                <th style={{ width: '100px' }}>TEM</th>
                                <th>PG</th>
                                <th>Saldo Inicial</th>
                                <th>Interés</th>
                                <th>Cuota</th>
                                <th>Amort.</th>
                                <th>Prepago</th>
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
                                <td colSpan={14}></td>
                                <td>{148530}</td>
                            </tr>
                            {
                                payments.map(pay => (
                                    <tr>
                                        <td>{pay.n}</td>
                                        <td>{pay.tea} %</td>
                                        <td>{pay.tep.toFixed(5)} %</td>
                                        <td>{pay.pg}</td>
                                        <td>{pay.si.toFixed(2)}</td>
                                        <td>{pay.i.toFixed(2)}</td>
                                        <td>{pay.cuota.toFixed(2)}</td>
                                        <td>{pay.a.toFixed(2)}</td>
                                        <td>{pay.pp}</td>
                                        <td>{pay.segDes.toFixed(2)}</td>
                                        <td>{pay.segRis.toFixed(2)}</td>
                                        <td>{pay.segRis}</td>
                                        <td>{pay.portes}</td>
                                        <td>{pay.gastAdm}</td>
                                        <td>{pay.sf.toFixed(2)}</td>
                                        <td>{pay.flujo.toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <br />
        </>
    )
}
