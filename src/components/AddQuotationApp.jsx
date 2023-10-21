import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { openModal, setVisible, showToastInfo } from '../utils'
import { FindCarApp } from './FindCarApp'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ScheduleApp } from './ScheduleApp'

export const AddQuotationApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            notarial_cost: '150',
            registration_cost: '250',
            appraisal: '80',
            study_fee: '50',
            shipping: '3.5',
            credit_life_insurence: '0.05',
            risk_insurence: '0.3',
            frecuency_pay: '30'
        }
    });
    const [currency, setCurrency] = useState();
    const [user, setuser] = useState();
    const [car, setcar] = useState()
    const [balanceFinance, setBalanceFinance] = useState()
    const [loanAmount, setLoanAmount] = useState()
    const [numberDuesYear, setNumberDuesYear] = useState()
    const [totalDues, settotalDues] = useState()
    const [insureDeduct, setInsureDeduct] = useState()
    const [riskInsure, setRiskInsure] = useState()
    const [quotation, setquotation] = useState(null);
    const allForm = watch();
    const submitSchedule = (data) => {
        if (!user || !car) return showToastInfo('Debe completar todos los campos');
        const quatotationData = {
            customer: user._id,
            frecuencyPay: parseInt(data.frecuency_pay),
            numDues: totalDues,
            fee: parseFloat(data.fee),
            insure: parseFloat(data.credit_life_insurence),
            loanAmount,
            risk: riskInsure,
            portes: parseFloat(data.shipping) || 0,
            cok: parseFloat(data.cok) || 0,
            gastAdm: parseFloat(data.administration_expenses) || 0,
            comision: parseFloat(data.periodic_commission) || 0,
            currency: data.currency,
            daysYear: parseFloat(data.days_year)
        }
        setquotation(quatotationData);
        setVisible('#box_add_datatation', false);
        setVisible('#box_schedule', true);
    }
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
        setNumberDuesYear(frecuencyPay && (daysYear / frecuencyPay));
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
                <div id="box_schedule" style={{ display: 'none' }}>
                    < ScheduleApp quotation={quotation} handleVisible={() => {
                        setVisible('#box_add_datatation', true);
                        setVisible('#box_schedule', false);
                    }} />
                </div>
                <div id="box_add_datatation">
                    <br />
                    <h4>GENERAR COTIZACIÓN</h4>
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
                                <select {...register('currency', { required: true })} className='form-control bg-white' {...register('currency')} onChange={(e) => setCurrency(e.target.value)}>
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
                                    <select className='form-control bg-white' {...register('cok_type', { required: true })}>
                                        <option value="efectiva">Efectiva</option>
                                        <option value="nominal">Nominal</option>
                                    </select>
                                    <input type="number" step={0.00001} className='form-control bg-white ml-1' placeholder='25.5%' {...register('cok', { required: true, type: 'number' })} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h6 className='mt-4'>Datos del prestamo</h6>
                            <hr />
                            <span className='form-label mt-2'>Precio de venta del Vehículo</span>
                            <input
                                value={car ? car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : ''}
                                className="form-control"
                                readOnly
                                onFocus={() => openModal('#find_car')}
                            />
                            <div className="form-group mt-2">
                                <span className='form-label'>Cuota Inicial</span>
                                <select className='form-control bg-white' {...register('initial_due', { required: true })}>
                                    <option value="20">20%</option>
                                    <option value="30">30%</option>
                                </select>
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Tasa de interés</span>
                                <div className="input-group">
                                    <select className='form-control bg-white' {...register('rate_type', { required: true })}>
                                        <option value="efectiva">Efectiva</option>
                                        <option value="nominal">Nominal</option>
                                        <option value="descuento">Descuento</option>
                                    </select>
                                    <input type="number" step={0.00001} className='form-control bg-white ml-1' placeholder='25.5%' {...register('fee', { required: true })} />
                                </div>
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Número de años</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('num_years', { required: true })} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Frecuencia de pago</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('frecuency_pay', { required: true })} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>N° de dias al año</span>
                                <select className='form-control bg-white' {...register('days_year', { required: true })}>
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
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('notarial_cost')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Costos registrales</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('registration_cost')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Tasación</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('appraisal')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Comisión de estudio</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('study_fee')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Comisión de activación</span>
                                <input type="number" step={0.00001} className="form-control bg-white" {...register('activation_fee')} />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h6 className='mt-4'>Gastos periodicos</h6>
                            <hr />
                        </div>
                        <div className="col-md-6">

                            <div className="form-group">
                                <span className='form-label'>Comisión periodica</span>
                                <input type="number" step={0.00001} className='form-control bg-white' placeholder='0.0502%' {...register('periodic_commission')} />
                            </div>
                            <div className="form-group">
                                <span className='form-label'>Portes</span>
                                <input type="number" step={0.00001} className='form-control bg-white' placeholder='0.0502%' {...register('shipping')} />
                            </div>
                            <div className="form-group">
                                <span className='form-label'>Gastos de administración</span>
                                <input type="number" step={0.00001} className='form-control bg-white' placeholder='0.0502%' {...register('administration_expenses')} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <span className='form-label'>Seguro de desgravamen (%)</span>
                                <input type="number" step={0.00001} className='form-control bg-white' placeholder='0.0502%' {...register('credit_life_insurence')} />
                            </div>
                            <div className="form-group">
                                <span className='form-label'>Seguro de riesgo (%)</span>
                                <input type="number" step={0.00001} className='form-control bg-white' placeholder='0.0502%' {...register('risk_insurence')} />
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
                                <input type="text" className='form-control bg-white' readOnly value={totalDues ? totalDues : ''} />
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>% de Seguro desgrav. per.</span>
                                <input type="text" className='form-control bg-white' readOnly value={`${insureDeduct} %`} />
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>Seguro riesgo</span>
                                <input type="text" className='form-control bg-white' readOnly value={riskInsure && riskInsure.toFixed(4)} />
                            </div>
                        </div>
                        <div className="col-md-12 text-center">
                            <button className='btn btn-success mt-3' type='submit'>SIGUIENTE</button>
                        </div>
                    </form>
                </div>
            </div>
            <br />
            <br />
        </>
    )
}
