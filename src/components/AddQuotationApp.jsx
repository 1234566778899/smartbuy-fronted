import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { closeModal, openModal, setVisible, showToastInfo } from '../utils'
import { FindCarApp } from './FindCarApp'
import { useForm } from 'react-hook-form'
import { ScheduleApp } from './ScheduleApp'

export const AddQuotationApp = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            notarial_cost: '150',
            registration_cost: '250',
            appraisal: '80',
            study_fee: '50',
            shipping: '3.5',
            credit_life_insurence: '0.05',
            risk_insurence: '0.3',
            frecuency_pay: '30',
            periodic_commission: '0',
            administration_expenses: '0',
            activation_fee: '0'
        }
    });

    const [user, setuser] = useState(null);
    const [car, setcar] = useState(null)
    const [balanceFinance, setBalanceFinance] = useState(0)
    const [loanAmount, setLoanAmount] = useState(0)
    const [numberDuesYear, setNumberDuesYear] = useState(0)
    const [totalDues, settotalDues] = useState(0)
    const [insureDeduct, setInsureDeduct] = useState(0)
    const [riskInsure, setRiskInsure] = useState(0)
    const [quotation, setquotation] = useState(null);
    const [initialCost, setinitialCost] = useState(0);
    const [initialDue, setinitialDue] = useState(0);
    const [finalDue, setfinalDue] = useState(0);
    const allForm = watch();

    const submitSchedule = (data) => {
        if (!user) return showToastInfo('Debe seleccionar un cliente');
        if (!car) return showToastInfo('Debe seleccionar un auto');

        const daysYear = parseFloat(data.days_year);
        const cok = data.cok_type === 'efectiva' ? parseFloat(data.cok) : (Math.pow(1 + ((parseFloat(data.cok) / 100) / 360), daysYear) - 1) * 100;
        const fee = data.rate_type == 'efectiva' ? parseFloat(data.fee) : (Math.pow(1 + ((parseFloat(data.fee) / 100) / 360), daysYear) - 1) * 100;
        const quatotationData = {
            customer: user._id,
            frecuencyPay: parseInt(data.frecuency_pay),
            numDues: totalDues,
            fee,
            insure: parseFloat(data.credit_life_insurence),
            loanAmount,
            risk: riskInsure,
            portes: parseFloat(data.shipping) || 0,
            cok,
            gastAdm: parseFloat(data.administration_expenses) || 0,
            comision: parseFloat(data.periodic_commission) || 0,
            currency: data.currency,
            daysYear,
            initialDue: initialDue,
            finalDue: finalDue,
            initialCost
        }
        setquotation({ ...quatotationData, car, customer: user });
        setVisible('#box_add_datatation', false);
        setVisible('#box_schedule', true);
    }
    useEffect(() => {
        const priceCar = (car && car.price) || 0;
        const _initialDue = parseFloat(allForm.initial_due) || 0;
        const _finalDue = parseFloat(allForm.final_due) || 0;
        setinitialDue(priceCar * _initialDue / 100);
        setfinalDue(priceCar * _finalDue / 100);
        const _balanceFinance = priceCar * (100 - _initialDue) / 100;
        setBalanceFinance(_balanceFinance);
        const notarialCost = parseFloat(allForm.notarial_cost) || 0;
        const registrationCost = parseFloat(allForm.registration_cost) || 0;
        const appraisal = parseFloat(allForm.appraisal) || 0;
        const studyFee = parseFloat(allForm.study_fee) || 0;
        const activationFee = parseFloat(allForm.activation_fee) || 0;
        const total = notarialCost + registrationCost + appraisal + studyFee + activationFee;
        setinitialCost(total);
        setLoanAmount(total + _balanceFinance);
        const numAnios = parseInt(allForm.num_years) || 0;
        const frecuencyPay = parseInt(allForm.frecuency_pay) || 0;
        const daysYear = parseInt(allForm.days_year) || 0;
        if (frecuencyPay > 0) {
            setNumberDuesYear(frecuencyPay && (daysYear / frecuencyPay));
            settotalDues((daysYear / frecuencyPay) * numAnios);
        }
        const creditLifeEnsurence = parseFloat(allForm.credit_life_insurence) || 0;
        const riskEnsurence = parseFloat(allForm.risk_insurence) || 0;
        setInsureDeduct((creditLifeEnsurence) / 30 * frecuencyPay);
        if (numberDuesYear) {
            setRiskInsure((riskEnsurence / 100) * priceCar / numberDuesYear);
        }
    }, [car, allForm])

    return (
        <>
            <FindCustomerApp selectUser={setuser} />
            <FindCarApp selectCar={setcar} />
            <NavApp logged={true} />
            <form className="container" onSubmit={handleSubmit(submitSchedule)}>
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
                    <div className="row" >
                        <div className="col-md-6 shadow-sm bg-white">
                            <div className="form-group">
                                <span className='form-label'>Cliente</span>
                                <input type="text" className='form-control' readOnly value={user ? `${user.name} ${user.lname} - ${user.documentNumber}` : ''} onFocus={() => openModal('#find_customer')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Moneda</span>
                                <select {...register('currency', { required: true })} className='form-control'>
                                    <option value="PEN">Soles</option>
                                    <option value="USD">Dolares</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="shadow-sm bg-white p-2">
                                <h6 className="mt-4">Costo de oportunidad</h6>
                                <hr />
                                <div className="form-group">
                                    <span className='form-label'>Tasa (Anual)</span>
                                    <div className="input-group">
                                        <select className='form-control' {...register('cok_type', { required: true })}>
                                            <option value="efectiva">Efectiva</option>
                                            <option value="nominal">Nominal</option>
                                        </select>
                                        <input type="number" step={0.00001} className='form-control ml-1' placeholder='25.5%' {...register('cok', {
                                            required: true, validate: {
                                                positive: value => parseFloat(value) > 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 shadow-sm mt-2 bg-white">
                            <h6 className='mt-4'>Datos del prestamo</h6>
                            <hr />
                            <span className='form-label mt-2'>Precio de venta del Vehículo</span>
                            <input
                                id='inp_car'
                                value={car ? car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : ''}
                                className="form-control"
                                readOnly
                                onFocus={() => openModal('#find_car')}
                            />
                            <div className="d-flex">
                                <div className="form-group mt-2 w-100">
                                    <span className='form-label'>Cuota Inicial</span>
                                    <select className='form-control' {...register('initial_due', { required: true })}>
                                        <option value="20">20%</option>
                                        <option value="30">30%</option>
                                    </select>
                                </div>
                                <div className="form-group mt-2 w-100 ml-2">
                                    <span className='form-label'>Cuota final</span>
                                    <select className='form-control' {...register('final_due', { required: true })}>
                                        <option value="40">40%</option>
                                        <option value="50">50%</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Tasa de interés (Anual)</span>
                                <div className="input-group">
                                    <select className='form-control' {...register('rate_type', { required: true })}>
                                        <option value="efectiva">Efectiva</option>
                                        <option value="nominal">Nominal</option>
                                    </select>
                                    <input type="number" step={0.00001} className='form-control ml-1' placeholder='25.5%' {...register('fee', {
                                        required: true, validate: {
                                            positive: value => parseFloat(value) > 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Número de años</span>
                                <select className='form-control' {...register('num_years', { required: true })}>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div className="d-flex">
                                <div className="form-group mt-2 w-100">
                                    <span className='form-label'>Frecuencia de pago (Dias)</span>
                                    <input type="number" className="form-control" {...register('frecuency_pay')} readOnly />
                                </div>
                                <div className="form-group mt-2 ml-2 w-100">
                                    <span className='form-label'>N° de dias al año</span>
                                    <select className='form-control w-100' {...register('days_year', { required: true })}>
                                        <option value="360">360</option>
                                        <option value="365">365</option>
                                    </select>
                                </div>
                            </div>


                        </div>
                        <div className="col-md-6 mt-2">
                            <div className='shadow-sm bg-white p-2'>
                                <h6 className='mt-4'>Gastos iniciales</h6>
                                <hr />
                                <div className="form-group mt-2">
                                    <span className='form-label'>Costos notariales</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('notarial_cost', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Costos registrales</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('registration_cost', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Tasación</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('appraisal', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Comisión de estudio</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('study_fee', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Comisión de activación</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('activation_fee', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="row bg-white shadow-sm mt-2">
                        <div className="col-md-12">
                            <h6 className='mt-4'>Gastos periodicos</h6>
                            <hr />
                        </div>
                        <div className="col-md-6">

                            <div className="form-group">
                                <span className='form-label'>Comisión periodica</span>
                                <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('periodic_commission', {
                                    validate: {
                                        positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                    }
                                })} />
                            </div>
                            <div className="d-flex">
                                <div className="form-group w-100">
                                    <span className='form-label'>Portes</span>
                                    <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('shipping', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <div className="form-group w-100 ml-2">
                                    <span className='form-label'>Gastos de administración</span>
                                    <input type="number" step={0.00001} className='form-control' placeholder='0..' {...register('administration_expenses', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <span className='form-label'>Seguro de desgravamen (%)</span>
                                <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('credit_life_insurence', {
                                    validate: {
                                        positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                    }
                                })} />
                            </div>
                            <div className="form-group">
                                <span className='form-label'>Seguro de riesgo (%)</span>
                                <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('risk_insurence', {
                                    validate: {
                                        positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                    }
                                })} />
                            </div>
                        </div>
                    </div>
                    <div className="row bg-white shadow-sm mt-2">
                        <div className="col-md-12 mt-3">
                            <h6>Resultados</h6>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex">
                                <div className='form-group w-100 mr-1'>
                                    <span className='form-label'>Cuota inicial</span>
                                    <input type="text" className='form-control' readOnly value={initialDue} />
                                </div>
                                <div className='form-group w-100 ml-1'>
                                    <span className='form-label'>Cuota final</span>
                                    <input type="text" className='form-control' readOnly value={finalDue} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>Saldo a financiar</span>
                                <input type="text" className='form-control' readOnly value={balanceFinance} />
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>Monto del prestamo</span>
                                <input type="text" className='form-control' readOnly value={loanAmount} />
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="d-flex">
                                <div className='form-group w-100 mr-1'>
                                    <span className='form-label'>N° de cuotas al año</span>
                                    <input type="text" className='form-control' readOnly value={numberDuesYear} />
                                </div>
                                <div className='form-group w-100 ml-1'>
                                    <span className='form-label'>N° total de cuotas</span>
                                    <input type="text" className='form-control' readOnly value={totalDues ? totalDues : ''} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>% de Seguro desgrav. per.</span>
                                <input type="text" className='form-control' readOnly value={`${insureDeduct} %`} />
                            </div>
                            <div className='form-group'>
                                <span className='form-label'>Seguro riesgo</span>
                                <input type="text" className='form-control' readOnly value={riskInsure && riskInsure.toFixed(4)} />
                            </div>
                        </div>

                    </div>
                    <div className="col-md-12 text-center">
                        <button className='btn btn-success mt-3 shadow-sm' type='submit'>SIGUIENTE</button>
                    </div>
                </div>
            </form>
            <br />
            <br />
        </>
    )
}
