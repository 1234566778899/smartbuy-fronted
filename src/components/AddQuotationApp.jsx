import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { openModal, setVisible, showToastInfo } from '../utils'
import { FindCarApp } from './FindCarApp'
import { useForm } from 'react-hook-form'
import { ScheduleApp } from './ScheduleApp'

export const AddQuotationApp = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            notarial_cost: '100',
            registration_cost: '75',
            appraisal: '0',
            study_fee: '0',
            shipping: '3.5',
            credit_life_insurence: '0.049',
            risk_insurence: '0.3',
            frecuency_pay: '30',
            periodic_commission: '20',
            administration_expenses: '3.5',
            activation_fee: '0',
            capPeriod: '1'
        }
    });

    const [user, setuser] = useState(null);
    const [car, setcar] = useState(null);
    const [quotation, setQuotation] = useState(null);
    const [tem, settem] = useState(0);
    const [tea, settea] = useState(0);
    const [saldoFinanciar, setsaldoFinanciar] = useState(0);
    const [prestamo, setPrestamo] = useState(0);
    const allForm = watch();
    const [cuotaInicial, setCuotaInicial] = useState(0);
    const [cuotaFinal, setCuotaFinal] = useState(0);
    const [totalCuotas, setTotalCuotas] = useState(0);
    const [segRisk, setSegRisk] = useState(0);
    const submitSchedule = (data) => {
        if (!user) return showToastInfo('Debe seleccionar un cliente');
        if (!car) return showToastInfo('Debe seleccionar un auto');
        const quatotationData = {
            customer: user._id,
            frecuencyPay: Number(allForm.frecuency_pay),
            numDues: totalCuotas,
            fee: Number(tea),
            tem: Number(tem),
            insure: Number(allForm.seguroDes),
            loanAmount: saldoFinanciar,
            risk: segRisk,
            portes: Number(allForm.shipping),
            cok: Number(allForm.cok),
            gastAdm: Number(allForm.administration_expenses),
            comision: Number(allForm.periodic_commission),
            currency: allForm.currency,
            daysYear: Number(allForm.days_year),
            initialDue: cuotaInicial,
            finalDue: cuotaFinal,
            initialCost: 0
        }
        setQuotation({ ...quatotationData, car, customer: user });
        setVisible('#box_add_datatation', false);
        setVisible('#box_schedule', true);

    }

    useEffect(() => {
        let _tea = (allForm.rate_type == 'efectiva' ? allForm.fee : (Math.pow(1 + (allForm.fee / 100) / (allForm.days_year / allForm.capPeriod), (allForm.days_year / allForm.capPeriod)) - 1) * 100) || 0;
        let _tem = (Math.pow(1 + _tea / 100, allForm.frecuency_pay / allForm.days_year) - 1) * 100;
        let _prestamo = (car && ((100 - allForm.initial_due) / 100) * car.price + Number(allForm.activation_fee) + Number(allForm.appraisal) + Number(allForm.notarial_cost) + Number(allForm.registration_cost) + Number(allForm.study_fee)) || 0;
        let cf = allForm.num_years == '2' ? 50 : 40;
        let _cuotaFinal = (car && (cf / 100) * car.price) || 0;
        let _cuotaInicial = (car && (allForm.initial_due / 100) * car.price) || 0;
        let _totalCuotas = (allForm.days_year / allForm.frecuency_pay) * allForm.num_years || 0;
        let _saldoFinanciar = (_prestamo - (_cuotaFinal / Math.pow(1 + (_tem / 100) + (allForm.credit_life_insurence / 100), _totalCuotas + 1))) || 0;
        let _segRisk = (car && (allForm.risk_insurence / 100) * car.price / (allForm.days_year / allForm.frecuency_pay)) || 0;
        setCuotaFinal(_cuotaFinal);
        setCuotaInicial(_cuotaInicial);
        settea(_tea);
        settem(_tem);
        setTotalCuotas(_totalCuotas);
        setsaldoFinanciar(_saldoFinanciar);
        setPrestamo(_prestamo);
        setSegRisk(_segRisk);
    }, [allForm])
    return (
        <>
            <FindCustomerApp selectUser={setuser} />
            <FindCarApp selectCar={setcar} />
            <NavApp logged={true} />
            <form className="container" onSubmit={handleSubmit(submitSchedule)}>
                <div id="box_schedule" style={{ display: 'none' }}>
                    {
                        quotation && (< ScheduleApp quotation={quotation} handleVisible={() => {
                            setVisible('#box_add_datatation', true);
                            setVisible('#box_schedule', false);
                        }} />)
                    }
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
                                    <span className='form-label'>tasa de descuento anual (COK)</span>
                                    <div className="input-group">
                                        <select className='form-control' {...register('cok_type', { required: true })}>
                                            <option value="efectiva">TEA</option>
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
                            <div className="d-flex">
                                <div className='w-100 mr-1'>
                                    <span className='form-label mt-2'>Precio de venta del Vehículo</span>
                                    <input
                                        id='inp_car'
                                        value={car ? car.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : ''}
                                        className="form-control"
                                        readOnly
                                        onFocus={() => openModal('#find_car')}
                                    />
                                </div>
                                <div className="w-100 ml-1">
                                    <span className='form-label'>Tipo de plan de pagos</span>
                                    <select className='form-control' {...register('num_years', { required: true })}>
                                        <option value="2">Plan 24</option>
                                        <option value="3">Plan 36</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="form-group mt-2 w-100">
                                    <span className='form-label'>Cuota Inicial</span>
                                    <select className='form-control' {...register('initial_due', { required: true })}>
                                        <option value="20">20%</option>
                                        {/* <option value="30">30%</option> */}
                                    </select>
                                </div>
                                <div className="form-group mt-2 w-100 ml-2">
                                    <span className='form-label'>Cuota final</span>
                                    <select className='form-control' value={`${allForm.num_years == '2' ? '50' : '40'}`} {...register('final_due', { required: true })} readOnly>
                                        <option value="40">40%</option>
                                        <option value="50">50%</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex mt-2">
                                <div className='w-100 mr-1'>
                                    <span className='form-label mt-2'>Número de años</span>
                                    <input className="form-control" readOnly value={allForm.num_years} />
                                </div>
                                <div className='w-100 ml-1'>
                                    <span>Tasa de Interés</span>
                                    <input type="number" step={0.00001} className='form-control ml-1' placeholder='10.5%' {...register('fee', {
                                        required: true, validate: {
                                            positive: value => parseFloat(value) > 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                            </div>
                            <div className="d-flex mt-2">
                                <div className="w-100">
                                    <span className='form-label'>Tipo de tasa de interés</span>
                                    <select className='form-control' {...register('rate_type', { required: true })}>
                                        <option value="efectiva">TEA</option>
                                        <option value="nominal">TNA</option>
                                    </select>
                                </div>
                                <div className="w-100">
                                    <span className='form-label'>Periodo de capitalización</span>
                                    <select className='form-control ml-2' {...register('capPeriod', { required: true })}>
                                        <option value="1">Diaria</option>
                                        <option value="30">Mensual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex mt-2">
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
                                <h6 className='mt-2'>Gastos iniciales</h6>
                                <hr />
                                <div className="d-flex">
                                    <div className="w-100 mr-1">
                                        <span className='form-label'>Costos notariales</span>
                                        <input type="number" step={0.00001} className="form-control" {...register('notarial_cost', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                    <div className="w-100 ml-1">
                                        <span className='form-label'>Costos registrales</span>
                                        <input type="number" step={0.00001} className="form-control" {...register('registration_cost', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="w-100 mr-1">
                                        <span className='form-label'>Tasación</span>
                                        <input type="number" step={0.00001} className="form-control" {...register('appraisal', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                    <div className="w-100 ml-1">
                                        <span className='form-label'>Comisión de estudio</span>
                                        <input type="number" step={0.00001} className="form-control" {...register('study_fee', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Comisión de activación</span>
                                    <input type="number" step={0.00001} className="form-control" {...register('activation_fee', {
                                        validate: {
                                            positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                        }
                                    })} />
                                </div>
                                <h6 className='mt-2'>Gastos periodicos</h6>
                                <hr />
                                <div className="d-flex">
                                    <div className="w-100 mr-1">
                                        <span className='form-label'>Comisión periodica</span>
                                        <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('periodic_commission', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                    <div className="w-100 ml-1 mr-1">
                                        <span className='form-label'>Portes</span>
                                        <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('shipping', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                    <div className="w-100 ml-1">
                                        <span className='form-label'>Gastos de administración</span>
                                        <input type="number" step={0.00001} className='form-control' placeholder='0..' {...register('administration_expenses', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                </div>
                                <div className="d-flex">

                                    <div className="w-100 mr-1">
                                        <span className='form-label'>Seguro de desgravamen (%)</span>
                                        <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('credit_life_insurence', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                    <div className="w-100 ml-1">
                                        <span className='form-label'>Seguro de riesgo (%)</span>
                                        <input type="number" step={0.00001} className='form-control' placeholder='0.0502%' {...register('risk_insurence', {
                                            validate: {
                                                positive: value => parseFloat(value) >= 0 || 'Debe ser un número positivo',
                                            }
                                        })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row bg-white shadow-sm mt-2 pb-4">
                        <div className="col-md-12 mt-3">
                            <h6>Resultados</h6>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex">
                                <div className='form-group w-100 mr-1'>
                                    <span className='form-label'>Tasa efectiva anual (TEA)</span>
                                    <input type="text" className='form-control' readOnly {...register('tea')}
                                        value={tea} />
                                </div>
                                <div className='form-group w-100 ml-1'>
                                    <span className='form-label'>Tasa efectiva mensual (TEM)</span>
                                    <input type="text" className='form-control' readOnly value={tem} />
                                </div>
                            </div>

                            <div className="d-flex">
                                <div className='w-100 mr-1'>
                                    <span className='form-label'>Cuota inicial</span>
                                    <input type="text" className='form-control' readOnly value={cuotaInicial} {...register('cuotaInicial')} />
                                </div>
                                <div className='w-100 ml-1'>
                                    <span className='form-label'>Cuota final</span>
                                    <input type="text" className='form-control' readOnly value={cuotaFinal} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <span className='form-label'>Monto del prestamo</span>
                                <input type="text" className='form-control' readOnly value={prestamo} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex">
                                <div className='form-group w-100 mr-1'>
                                    <span className='form-label'>N° de cuotas al año</span>
                                    <input type="text" className='form-control' readOnly value={(allForm.days_year / allForm.frecuency_pay) || ''} {...register('cuotasAnio')} />
                                </div>
                                <div className='form-group w-100 ml-1'>
                                    <span className='form-label'>N° total de cuotas</span>
                                    <input type="text" className='form-control' readOnly value={totalCuotas} {...register('totalCuotas')} />
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className='w-100 mr-1'>
                                    <span className='form-label'>% de Seguro desgrav. per.</span>
                                    <input type="text" className='form-control' readOnly value={allForm.credit_life_insurence * allForm.frecuency_pay / 30} {...register('seguroDes')} />
                                </div>
                                <div className='w-100 ml-1'>
                                    <span className='form-label'>Seguro riesgo</span>
                                    <input type="text" className='form-control' readOnly value={segRisk} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <span className='form-label'>Saldo a financiar con cuotas</span>
                                <input type="text" className='form-control' readOnly value={saldoFinanciar} />
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
