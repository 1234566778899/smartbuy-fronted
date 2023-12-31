import React, { useEffect, useState } from 'react'
import { NavApp } from './NavApp'
import { FindCustomerApp } from './FindCustomerApp'
import { openModal, setVisible, showToastInfo, soloNumerosDecimales } from '../utils'
import { FindCarApp } from './FindCarApp'
import { useForm } from 'react-hook-form'
import { ScheduleApp } from './ScheduleApp'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CONFI } from '../utils/config'
import { Entidades } from '../utils/Entidades'

export const AddQuotationApp = () => {
    const { id } = useParams();
    const [quotationReference, setQuotationReference] = useState();
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
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
    const [initialCost, setInitialCost] = useState(0);
    const [symbol, setSymbol] = useState('');
    const [valorActual, setvalorActual] = useState(0);
    const [precioReal, setPrecioReal] = useState(0);
    const [monedaActual, setMonedaActual] = useState('PEN');
    const [openDialog, setopenDialog] = useState(false);
    const submitSchedule = (data) => {
        if (!user) return showToastInfo('Debe seleccionar un cliente');
        if (!car) return showToastInfo('Debe seleccionar un auto');
        const quatotationData = {
            customer: {
                name: user.name,
                lname: user.lname,
                email: user.email,
                address: user.address,
                telephone: user.telephone,
                documentType: user.documentType,
                documentNumber: user.documentNumber,
            },
            frecuencyPay: Number(allForm.frecuency_pay),
            numDues: totalCuotas,
            fee: Number(tea),
            tem: Number(tem),
            insure: Number(allForm.credit_life_insurence),
            loanAmount: saldoFinanciar,
            monto: prestamo,
            risk: segRisk,
            portes: Number(allForm.shipping),
            cok: Number(allForm.cok),
            gastAdm: Number(allForm.administration_expenses),
            comision: Number(allForm.periodic_commission),
            currency: allForm.currency,
            daysYear: Number(allForm.days_year),
            initialDue: cuotaInicial,
            finalDue: cuotaFinal,
            initialCost: initialCost,
            comActivacion: Number(allForm.activation_fee),
            comEstudio: Number(allForm.study_fee),
            notariales: Number(allForm.notarial_cost),
            registrales: Number(allForm.registration_cost),
            tasacion: Number(allForm.appraisal),
            porcInicial: Number(allForm.initial_due),
            porcFinal: Number(allForm.final_due),
            tasaInteres: Number(allForm.fee),
            tipoTasa: allForm.rate_type,
            periodo: Number(allForm.capPeriod),
            real: precioReal,
            estado: id ? 'renovado' : 'pendiente',
            porcRisk: allForm.risk_insurence
        }
        setQuotation({ ...quatotationData, car });
        setVisible('#box_add_datatation', false);
    }
    const getQuotations = () => {
        axios.get(`${CONFI.uri}/quotation/${id}`)
            .then(res => {
                setQuotationReference(res.data);
                setvalorActual(res.data.reference - res.data.finalDue);
                setSymbol(res.data.currency == 'USD' ? '$' : 'S/.');
                cambiarValor(allForm.currency);
            })
            .catch(error => {
                console.log(error);
                showToastInfo('Error')
            })
    }
    const cambiarValor = (moneda) => {
        if (moneda == 'USD' && symbol == 'S/.') {
            setvalorActual(value => value / 3.80);
            setSymbol('$');
            setcar(null);
        } else if (moneda == 'PEN' && symbol == '$') {
            setvalorActual(value => value * 3.80);
            setSymbol('S/.');
            setcar(null);
        }
    }
    useEffect(() => {
        if (id) getQuotations();
        uploadDataFinance(1);
    }, [])

    useEffect(() => {
        let _tea = (allForm.rate_type == 'efectiva' ? Number(allForm.fee) : (Math.pow(1 + (allForm.fee / 100) / (allForm.days_year / allForm.capPeriod), (allForm.days_year / allForm.capPeriod)) - 1) * 100) || 0;
        let _tem = (Math.pow(1 + _tea / 100, allForm.frecuency_pay / allForm.days_year) - 1) * 100;
        let _initialCost = (Number(allForm.activation_fee) + Number(allForm.appraisal) + Number(allForm.notarial_cost) + Number(allForm.registration_cost) + Number(allForm.study_fee)) || 0;
        let _prestamo = (car && ((100 - allForm.initial_due) / 100) * precioReal + _initialCost) || 0;
        let cf = allForm.num_years == '2' ? 50 : 40;
        let _cuotaFinal = (car && (cf / 100) * precioReal) || 0;
        let _cuotaInicial = (car && (allForm.initial_due / 100) * precioReal) || 0;
        let _totalCuotas = (allForm.days_year / allForm.frecuency_pay) * allForm.num_years || 0;
        let _saldoFinanciar = (_prestamo - (_cuotaFinal / Math.pow(1 + (_tem / 100) + (allForm.credit_life_insurence / 100), _totalCuotas + 1))) || 0;
        let subd = allForm.timeRisk == 'mensual' ? 1 : (allForm.days_year / 30);
        let _segRisk = (car && (allForm.risk_insurence / 100) * car.price / subd) || 0;
        setCuotaFinal(_cuotaFinal);
        setInitialCost(_initialCost);
        setCuotaInicial(_cuotaInicial);
        settea(_tea);
        settem(_tem);
        setTotalCuotas(_totalCuotas);
        setsaldoFinanciar(_saldoFinanciar);
        setPrestamo(_prestamo);
        setSegRisk(_segRisk);
    }, [allForm]);

    const uploadDataFinance = (id) => {
        const entidad = Entidades.find(x => x.id == id);
        setValue('activation_fee', entidad.comisionActivacion);
        setValue('administration_expenses', entidad.gastosAdm);
        setValue('appraisal', entidad.tasacion);
        setValue('credit_life_insurence', entidad.seguroDesgravamen);
        setValue('notarial_cost', entidad.notariales);
        setValue('periodic_commission', entidad.periodica);
        setValue('risk_insurence', entidad.seguroRiesgo);
        setValue('shipping', entidad.portes);
        setValue('registration_cost', entidad.registrales);
        setValue('study_fee', entidad.comisionEstudio);
    }
    useEffect(() => {
        setMonedaActual(allForm.currency);
    }, [allForm.currency])

    useEffect(() => {
        if (car) {
            setPrecioReal(car.price - valorActual);
        }
    }, [car, valorActual])

    return (
        <div className='summary'>
            <FindCustomerApp selectUser={setuser} />
            {openDialog && <FindCarApp setDialog={setopenDialog} selectCar={setcar} currency={monedaActual} />}
            <NavApp logged={true} />
            <form className="container" onSubmit={handleSubmit(submitSchedule)}>
                {
                    quotation && (< ScheduleApp quotation={quotation} handleVisible={() => {
                        setVisible('#box_add_datatation', true);
                        setQuotation(null);
                    }} />)
                }
                <div id="box_add_datatation">
                    <br />
                    <h4>GENERAR COTIZACIÓN</h4>
                    <hr />
                    <br />
                    {
                        quotationReference &&
                        <p>Valor guardado: {symbol} {valorActual.toFixed(2)}</p>
                    }
                    <div className="row" >
                        <div className="col-md-6 shadow-sm bg-white">
                            <div className="form-group">
                                <span className='form-label'>Cliente</span>
                                <input type="text" className='form-control' readOnly value={user ? `${user.name} ${user.lname} - ${user.documentNumber}` : ''} onFocus={() => openModal('#find_customer')} />
                            </div>
                            <div className="form-group mt-2">
                                <span className='form-label'>Moneda</span>
                                <select {...register('currency', { required: true })} onChange={(e) => cambiarValor(e.target.value)} className='form-control'>
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
                                        <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control ml-1' placeholder='25.5%' {...register('cok', { required: true })} />
                                    </div>
                                </div>
                                {errors.cok && <span className='text-danger'>El cok es obligatorio</span>}
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
                                        value={car ? car.price : ''}
                                        className="form-control"
                                        readOnly
                                        onFocus={() => { setopenDialog(true); }}
                                    />
                                    {quotationReference && car && <p className='text-success'>Precio real: {precioReal.toFixed(2)}</p>}
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
                                    <input type="text" className='form-control' value={`${allForm.num_years == '2' ? '50' : '40'}`} {...register('final_due')} readOnly />
                                </div>
                            </div>
                            <div className="d-flex mt-2">
                                <div className='w-100 mr-1'>
                                    <span className='form-label mt-2'>Número de años</span>
                                    <input className="form-control" readOnly value={allForm.num_years} />
                                </div>
                                <div className='w-100'>
                                    <div className='w-100 ml-1'>
                                        <span>Tasa de Interés</span>
                                        <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control ml-1' placeholder='10.5%' {...register('fee', { required: true })} />
                                    </div>
                                    {errors.fee && <span className='text-danger'>La tasa de interes es obligatorio</span>}
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
                                <h5>Datos de la entidad financiera</h5>
                                <hr />
                                <div className="w-100 ml-1">
                                    <span className='form-label'>Seleccione la entidad financiera</span>
                                    <select className='form-control mr-1' onChange={(e) => uploadDataFinance(e.target.value)}>
                                        {
                                            Entidades.map(e => (<option key={e.id} value={e.id}>{e.name}</option>))
                                        }
                                    </select>
                                </div>
                                <div className="d-flex">
                                    <div className='w-100'>
                                        <div className="w-100 mr-1">
                                            <span className='form-label'>Costos notariales</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="number" className="form-control" {...register('notarial_cost', { required: true })} />
                                        </div>
                                        {errors.notarial_cost && <span className='text-danger d-block'>Los costos notariales es obligatorio</span>}
                                    </div>

                                    <div className='w-100'>
                                        <div className="w-100 ml-1">
                                            <span className='form-label'>Costos registrales</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className="form-control" {...register('registration_cost', { required: true })} />
                                        </div>
                                        {errors.registration_cost && <span className='text-danger'>Los costos registrales es obligatorio</span>}
                                    </div>
                                </div>


                                <div className="d-flex">
                                    <div className='w-100'>
                                        <div className="w-100 mr-1">
                                            <span className='form-label'>Tasación</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className="form-control" {...register('appraisal', { required: true })} />
                                        </div>
                                        {errors.appraisal && <span className='text-danger d-block'>La tasación es obligatorio</span>}
                                    </div>
                                    <div className='w-100'>
                                        <div className="w-100 ml-1">
                                            <span className='form-label'>Comisión de estudio</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className="form-control" {...register('study_fee', { required: true })} />
                                        </div>
                                        {errors.study_fee && <span className='text-danger'>La comisión de estudio es obligatorio</span>}
                                    </div>
                                </div>
                                <div className="form-group mt-2">
                                    <span className='form-label'>Comisión de activación</span>
                                    <input onInput={(e) => soloNumerosDecimales(e)} type="text" className="form-control" {...register('activation_fee', { required: true })} />
                                </div>
                                {errors.activation_fee && <span className='text-danger'>La comisión de activación es obligatorio</span>}
                                <div className="d-flex">
                                    <div className='w-100'>
                                        <div className="w-100 mr-1">
                                            <span className='form-label'>Comisión periodica</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control' placeholder='0.0502%' {...register('periodic_commission', { required: true })} />
                                        </div>
                                        {errors.periodic_commission && <span className='text-danger d-block'>La comisión periodica es obligatorio</span>}
                                    </div>
                                    <div className='w-100'>
                                        <div className="w-100 ml-1 mr-1">
                                            <span className='form-label'>Portes</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control' placeholder='0.0502%' {...register('shipping', { required: true })} />
                                        </div>
                                        {errors.shipping && <span className='text-danger'>Los portes es obligatorio</span>}
                                    </div>
                                    <div className='w-100'>
                                        <div className="w-100 ml-1">
                                            <span className='form-label'>Gastos de administración</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control' placeholder='0..' {...register('administration_expenses', { required: true })} />
                                        </div>
                                        {errors.administration_expenses && <span className='text-danger d-block'>Los gastos de administración es obligatorio</span>}
                                    </div>
                                </div>



                                <div className="d-flex">

                                    <div className='w-100'>
                                        <div className="w-100 mr-1">
                                            <span className='form-label'>Seguro de desgravamen (%)</span>
                                            <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control ml-1' placeholder='0.0502%' {...register('credit_life_insurence', { required: true })} />
                                        </div>
                                        {errors.credit_life_insurence && <span className='text-danger d-block'>El seguro de desgravamen es obligatorio</span>}
                                    </div>
                                    <div className='w-100'>
                                        <div className="w-100 ml-1">
                                            <span className='form-label'>Seguro de riesgo (%)</span>
                                            <div className="d-flex">
                                                <select className='form-control mr-1' {...register('timeRisk', { required: true })}>
                                                    <option value="anual">Anual</option>
                                                </select>
                                                <input onInput={(e) => soloNumerosDecimales(e)} type="text" className='form-control' placeholder='0.0502%' {...register('risk_insurence', { required: true })} />
                                            </div>
                                        </div>
                                        {errors.risk_insurence && <span className='text-danger'>El seguro de riesgo es obligatorio</span>}
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
                                    <input type="text" className='form-control' readOnly
                                        value={tea ? tea.toFixed(5) : 0} />
                                </div>
                                <div className='form-group w-100 ml-1'>
                                    <span className='form-label'>Tasa efectiva mensual (TEM)</span>
                                    <input type="text" className='form-control' readOnly value={tem ? tem.toFixed(5) : 0} />
                                </div>
                            </div>

                            <div className="d-flex">
                                <div className='w-100 mr-1'>
                                    <span className='form-label'>Cuota inicial</span>
                                    <input type="text" className='form-control' readOnly value={cuotaInicial.toFixed(2)} />
                                </div>
                                <div className='w-100 ml-1'>
                                    <span className='form-label'>Cuota final</span>
                                    <input type="text" className='form-control' readOnly value={cuotaFinal.toFixed(2)} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <span className='form-label'>Monto del prestamo</span>
                                <input type="text" className='form-control' readOnly value={prestamo.toFixed(2)} />
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
                                    <input type="text" className='form-control' readOnly
                                        value={allForm.credit_life_insurence}
                                    />
                                </div>
                                <div className='w-100 ml-1'>
                                    <span className='form-label'>Seguro riesgo</span>
                                    <input type="text" className='form-control' readOnly value={segRisk.toFixed(2)} />
                                </div>
                            </div>
                            <div className='w-100 mt-2'>
                                <span className='form-label'>Saldo a financiar con cuotas</span>
                                <input type="text" className='form-control' readOnly value={saldoFinanciar.toFixed(2)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 text-center">
                        <button className='btn btn-success mt-3 shadow-sm' type='submit'>SIGUIENTE</button>
                    </div>
                </div>
            </form >
            <br />
            <br />
        </div >
    )
}
